import { mkdir, rename, rm } from 'node:fs/promises'
import VError from 'verror'
import * as Debug from '../Debug/Debug.js'
import * as ExtensionManifestInputType from '../ExtensionManifestInputType/ExtensionManifestInputType.js'
import * as ExtensionManifests from '../ExtensionManifests/ExtensionManifests.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Queue from '../Queue/Queue.js'

export const install = async (id) => {
  // TODO this should be a stateless function, renderer-worker should have info on marketplace url
  // TODO use command.execute
  try {
    const { download } = await import('../Download/Download.js')
    const { extractTarBr } = await import('../Extract/Extract.js')
    const marketplaceUrl = Platform.getMarketplaceUrl()
    Debug.debug(`ExtensionManagement#install ${id}`)
    const cachedExtensionsPath = Platform.getCachedExtensionsPath()
    const extensionsPath = Platform.getExtensionsPath()
    // TODO maybe a queue is over engineering here
    await Queue.add('download', async () => {
      Debug.debug(`ExtensionManagement#download ${id}`)
      // TODO use command.execute
      await download(
        `${marketplaceUrl}/download/${id}`,
        Path.join(cachedExtensionsPath, `${id}.tar.br`)
      )
      Debug.debug(`ExtensionManagement#extract ${id}`)
      await extractTarBr(
        Path.join(cachedExtensionsPath, `${id}.tar.br`),
        Path.join(extensionsPath, id)
      )
    })
    // TODO should this be here? (probably not)
    // await ExtensionHost.enableExtension({
    //   id,
    //   type: 'marketplace',
    // })
  } catch (error) {
    throw new VError(error, `Failed to install extension "${id}"`)
  }
}

export const uninstall = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#uninstall ${id}`)
    const extensionsPath = Platform.getExtensionsPath()
    await rm(Path.join(extensionsPath, id), { recursive: true })
  } catch (error) {
    // if (error.code === 'ENOENT') {
    //   return
    // }
    throw new VError(error, `Failed to uninstall extension "${id}"`)
  }
}

export const enable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#enable ${id}`)
    const extensionsPath = Platform.getExtensionsPath()
    const disabledExtensionsPath = Platform.getDisabledExtensionsPath()
    await mkdir(extensionsPath, { recursive: true })
    await rename(
      Path.join(disabledExtensionsPath, id),
      Path.join(extensionsPath, id)
    )
  } catch (error) {
    throw new VError(error, `Failed to enable extension "${id}"`)
  }
}

export const disable = async (id) => {
  try {
    Debug.debug(`ExtensionManagement#disable ${id}`)
    const disabledExtensionsPath = Platform.getDisabledExtensionsPath()
    const extensionsPath = Platform.getExtensionsPath()
    await mkdir(disabledExtensionsPath, { recursive: true })
    await rename(
      Path.join(extensionsPath, id),
      Path.join(disabledExtensionsPath, id)
    )
  } catch (error) {
    throw new VError(error, `Failed to disable extension ${id}`)
  }
}

export const getBuiltinExtensions = () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getBuiltinExtensionsPath(),
    },
  ])
}

export const getInstalledExtensions = () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getExtensionsPath(),
    },
  ])
}

export const getExtensions = () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.OnlyExtension,
      path: Platform.getOnlyExtensionPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getLinkedExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getExtensionsPath(),
    },
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getBuiltinExtensionsPath(),
    },
  ])
}

export const getDisabledExtensions = () => {
  return ExtensionManifests.getAll([
    {
      type: ExtensionManifestInputType.Folder,
      path: Platform.getDisabledExtensionsPath(),
    },
  ])
}
