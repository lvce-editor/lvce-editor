import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import * as BuiltinExtensionsPath from '../BuiltinExtensionsPath/BuiltinExtensionsPath.ts'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.ts'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.ts'
import * as GetEtagFromStats from '../GetEtagFromStats/GetEtagFromStats.ts'
import * as GetExtensionEtags from '../GetExtensionEtags/GetExtensionEtags.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as TransientLinkedExtensions from '../TransientLinkedExtensions/TransientLinkedExtensions.ts'
import { VError } from '../VError/VError.ts'

export const enable = async (id: any): Promise<any> => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    const { disabledExtensionIds, enabledExtensionIds } = await getExtensionEnablement()
    if (!disabledExtensionIds.includes(id) && enabledExtensionIds.includes(id)) {
      return
    }
    const newDisabledExtensionIds = disabledExtensionIds.filter((extensionId: any) => extensionId !== id)
    const newEnabledExtensionIds = enabledExtensionIds.includes(id) ? enabledExtensionIds : [...enabledExtensionIds, id]
    const content = getNewExtensionEnablementContent(newDisabledExtensionIds, newEnabledExtensionIds)
    await mkdir(dirname(disabledExtensionsJsonPath), { recursive: true })
    await writeFile(disabledExtensionsJsonPath, content)
  } catch (error) {
    throw new VError(error, `Failed to enable extension "${id}"`)
  }
}

const getNewExtensionEnablementContent = (disabledExtensions: any, enabledExtensions: any): any => {
  const content =
    JSON.stringify(
      {
        disabledExtensions,
        enabledExtensions,
      },
      null,
      2,
    ) + '\n'
  return content
}

export const disable = async (id: any): Promise<any> => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    const { disabledExtensionIds, enabledExtensionIds } = await getExtensionEnablement()
    if (disabledExtensionIds.includes(id) && !enabledExtensionIds.includes(id)) {
      return
    }
    const newDisabledExtensionIds = disabledExtensionIds.includes(id) ? disabledExtensionIds : [...disabledExtensionIds, id]
    const newEnabledExtensionIds = enabledExtensionIds.filter((extensionId: any) => extensionId !== id)
    const content = getNewExtensionEnablementContent(newDisabledExtensionIds, newEnabledExtensionIds)
    await mkdir(dirname(disabledExtensionsJsonPath), { recursive: true })
    await writeFile(disabledExtensionsJsonPath, content)
  } catch (error) {
    throw new VError(error, `Failed to disable extension ${id}`)
  }
}

const getStringArray = (value: any): any => {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((extensionId: any) => typeof extensionId === 'string')
}

export const getExtensionEnablement = async (): Promise<any> => {
  try {
    const disabledExtensionsJsonPath = PlatformPaths.getDisabledExtensionsJsonPath()
    if (!existsSync(disabledExtensionsJsonPath)) {
      return {
        disabledExtensionIds: [],
        enabledExtensionIds: [],
      }
    }
    const content = await readFile(disabledExtensionsJsonPath, 'utf8')
    const parsed = JSON.parse(content)
    return {
      disabledExtensionIds: getStringArray(parsed?.disabledExtensions),
      enabledExtensionIds: getStringArray(parsed?.enabledExtensions),
    }
  } catch {
    return {
      disabledExtensionIds: [],
      enabledExtensionIds: [],
    }
  }
}

export const getDisabledExtensionIds = async (): Promise<any> => {
  const { disabledExtensionIds } = await getExtensionEnablement()
  return disabledExtensionIds
}

export const getBuiltinExtensions = (): any => {
  return ExtensionManifests.getAll(
    [
      {
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getInstalledExtensions = (): any => {
  return ExtensionManifests.getAll(
    [
      {
        path: PlatformPaths.getExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getExtensions = (): any => {
  const transientLinkedExtensions = TransientLinkedExtensions.getLinkedExtensions().map((link: any) => {
    return {
      path: link.resolvedPath,
      type: ExtensionManifestInputType.LinkedExtension,
    }
  })
  return ExtensionManifests.getAll(
    [
      {
        path: PlatformPaths.getOnlyExtensionPath(),
        type: ExtensionManifestInputType.OnlyExtension,
      },
      ...transientLinkedExtensions,
      {
        path: PlatformPaths.getExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
      {
        path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export const getExtensionsEtag = async (): Promise<any> => {
  const transientLinkedExtensions = TransientLinkedExtensions.getLinkedExtensions().map((link: any) => {
    return {
      path: link.resolvedPath,
      type: ExtensionManifestInputType.LinkedExtension,
    }
  })
  const stats = await GetExtensionEtags.getExtensionEtags([
    {
      path: PlatformPaths.getOnlyExtensionPath(),
      type: ExtensionManifestInputType.OnlyExtension,
    },
    ...transientLinkedExtensions,
    {
      path: PlatformPaths.getExtensionsPath(),
      type: ExtensionManifestInputType.Folder,
    },
    {
      path: BuiltinExtensionsPath.getBuiltinExtensionsPath(),
      type: ExtensionManifestInputType.Folder,
    },
  ])
  const etag = GetEtagFromStats.getEtagFromStats(stats)
  return etag
}

export const getLinkedExtensionDevelopmentConfig = (): any => {
  return TransientLinkedExtensions.getDevelopmentConfig()
}

export const getDisabledExtensions = (): any => {
  return ExtensionManifests.getAll(
    [
      {
        path: PlatformPaths.getDisabledExtensionsPath(),
        type: ExtensionManifestInputType.Folder,
      },
    ],
    BuiltinExtensionsPath.getBuiltinExtensionsPath(),
  )
}

export * from '../ExtensionUninstall/ExtensionUninstall.ts'
