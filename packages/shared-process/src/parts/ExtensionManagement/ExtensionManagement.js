import { mkdir, rename } from 'node:fs/promises'
import * as Debug from '../Debug/Debug.js'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as Path from '../Path/Path.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import { VError } from '../VError/VError.js'

export const enable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#enable ${id}`)
    const extensionsPath = PlatformPaths.getExtensionsPath()
    const disabledExtensionsPath = PlatformPaths.getDisabledExtensionsPath()
    await mkdir(extensionsPath, { recursive: true })
    await rename(Path.join(disabledExtensionsPath, id), Path.join(extensionsPath, id))
  } catch (error) {
    throw new VError(error, `Failed to enable extension "${id}"`)
  }
}

export const disable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#disable ${id}`)
    const disabledExtensionsPath = PlatformPaths.getDisabledExtensionsPath()
    const extensionsPath = PlatformPaths.getExtensionsPath()
    await mkdir(disabledExtensionsPath, { recursive: true })
    await rename(Path.join(extensionsPath, id), Path.join(disabledExtensionsPath, id))
  } catch (error) {
    throw new VError(error, `Failed to disable extension ${id}`)
  }
}

export const getBuiltinExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getBuiltinExtensionsPath(),
      },
    ],
    PlatformPaths.getBuiltinExtensionsPath(),
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
    PlatformPaths.getBuiltinExtensionsPath(),
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
        path: PlatformPaths.getBuiltinExtensionsPath(),
      },
    ],
    PlatformPaths.getBuiltinExtensionsPath(),
  )
}

export const getDisabledExtensions = () => {
  return ExtensionManifests.getAll(
    [
      {
        type: ExtensionManifestInputType.Folder,
        path: PlatformPaths.getDisabledExtensionsPath(),
      },
    ],
    PlatformPaths.getBuiltinExtensionsPath(),
  )
}

export * from '../ExtensionUninstall/ExtensionUninstall.js'
