import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.js'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as GetEtagFromStats from '../GetEtagFromStats/GetEtagFromStats.js'
import * as GetExtensionEtags from '../GetExtensionEtags/GetExtensionEtags.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import { VError } from '../VError/VError.js'

export const enable = async (id) => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    const oldDisabledExtensionIds = await getDisabledExtensionIds()
    if (!oldDisabledExtensionIds.includes(id)) {
      return
    }
    const newDisabledExtensionIds = oldDisabledExtensionIds.filter((extensionId) => extensionId !== id)
    const content = getNewDisabledExtensionContent(newDisabledExtensionIds)
    await mkdir(dirname(disabledExtensionsJsonPath), { recursive: true })
    await writeFile(disabledExtensionsJsonPath, content)
  } catch (error) {
    throw new VError(error, `Failed to enable extension "${id}"`)
  }
}

const getNewDisabledExtensionContent = (disabledExtensions) => {
  const content =
    JSON.stringify(
      {
        disabledExtensions,
      },
      null,
      2,
    ) + '\n'
  return content
}

export const disable = async (id) => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    const oldDisabledExtensionIds = await getDisabledExtensionIds()
    if (oldDisabledExtensionIds.includes(id)) {
      return
    }
    const newDisabledExtensionIds = [...oldDisabledExtensionIds, id]
    const content = getNewDisabledExtensionContent(newDisabledExtensionIds)
    await mkdir(dirname(disabledExtensionsJsonPath), { recursive: true })
    await writeFile(disabledExtensionsJsonPath, content)
  } catch (error) {
    throw new VError(error, `Failed to disable extension ${id}`)
  }
}

export const getDisabledExtensionIds = async () => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    if (!existsSync(disabledExtensionsJsonPath)) {
      return []
    }
    const content = await readFile(disabledExtensionsJsonPath, 'utf8')
    const parsed = JSON.parse(content)
    if (!parsed || !parsed.disabledExtensions || !Array.isArray(parsed.disabledExtensions)) {
      return []
    }
    return parsed.disabledExtensions.filter((extensionId) => typeof extensionId === 'string')
  } catch {
    return []
  }
}

export const getBuiltinExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.Folder,
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getInstalledExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getExtensionsPath(),
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.OnlyExtension,
        path: PlatformPaths.getOnlyExtensionPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getLinkedExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getExtensionsPath(),
      },
      {
        type: ExtensionManifestInputType.Folder,
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getExtensionsEtag = async () => {
  const stats = await GetExtensionEtags.getExtensionEtags([
    {
      type: ExtensionManifestInputType.OnlyExtension,
      path: PlatformPaths.getOnlyExtensionPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: PlatformPaths.getLinkedExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: PlatformPaths.getExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
    },
  ])
  const etag = GetEtagFromStats.getEtagFromStats(stats)
  return etag
}

export const getDisabledExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getDisabledExtensionsPath(),
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export * from '../ExtensionUninstall/ExtensionUninstall.js'
