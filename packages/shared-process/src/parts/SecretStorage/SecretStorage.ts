import * as ElectronSafeStorage from '../ElectronSafeStorage/ElectronSafeStorage.ts'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Queue from '../Queue/Queue.ts'

type StoredSecrets = Readonly<Record<string, Readonly<Record<string, string>>>>

const queueKey = 'secret-storage'

const getStoragePath = (): string => {
  return Path.join(PlatformPaths.getConfigDir(), 'secrets.json')
}

const readStoredSecrets = async (): Promise<StoredSecrets> => {
  try {
    const stored = await JsonFile.readJson(getStoragePath())
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
      return {}
    }
    return stored
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return {}
    }
    throw error
  }
}

export const get = async (extensionId: string, key: string): Promise<string | undefined> => {
  const stored = await readStoredSecrets()
  const encrypted = stored[extensionId]?.[key]
  if (typeof encrypted !== 'string') {
    return undefined
  }
  return ElectronSafeStorage.decryptString(encrypted)
}

export const list = async (): Promise<readonly { readonly extensionId: string; readonly key: string }[]> => {
  const stored = await readStoredSecrets()
  const secrets: { extensionId: string; key: string }[] = []
  for (const [extensionId, extensionSecrets] of Object.entries(stored)) {
    if (!extensionSecrets || typeof extensionSecrets !== 'object' || Array.isArray(extensionSecrets)) {
      continue
    }
    for (const [key, encrypted] of Object.entries(extensionSecrets)) {
      if (typeof encrypted === 'string') {
        secrets.push({ extensionId, key })
      }
    }
  }
  return secrets
}

export const store = async (extensionId: string, key: string, value: string): Promise<void> => {
  await Queue.add(queueKey, async () => {
    const encrypted = await ElectronSafeStorage.encryptString(value)
    const stored = await readStoredSecrets()
    await JsonFile.writeJson(getStoragePath(), {
      ...stored,
      [extensionId]: {
        ...stored[extensionId],
        [key]: encrypted,
      },
    })
  })
}

export const deleteSecret = async (extensionId: string, key: string): Promise<void> => {
  await Queue.add(queueKey, async () => {
    const stored = await readStoredSecrets()
    const extensionSecrets = stored[extensionId]
    if (!extensionSecrets || typeof extensionSecrets[key] !== 'string') {
      return
    }
    const nextExtensionSecrets = { ...extensionSecrets }
    delete nextExtensionSecrets[key]
    const nextStored = { ...stored }
    if (Object.keys(nextExtensionSecrets).length === 0) {
      delete nextStored[extensionId]
    } else {
      nextStored[extensionId] = nextExtensionSecrets
    }
    await JsonFile.writeJson(getStoragePath(), nextStored)
  })
}
