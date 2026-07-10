import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as FilePicker from '../FilePicker/FilePicker.js'
import * as IsAbortError from '../IsAbortError/IsAbortError.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { VError } from '../VError/VError.js'

const storageKey = 'installedWebExtensionsFromDisk'
const handlePrefix = 'local-extension://'

const getHandleKey = (id) => {
  return `${handlePrefix}${id}`
}

const getExtensionUrl = async (id) => {
  const href = await RendererProcess.invoke('Location.getHref')
  const origin = new URL(href).origin
  const assetBaseUrl = new URL(`${assetDir}/`, origin)
  return new URL(`../local-extensions/${encodeURIComponent(id)}`, assetBaseUrl).href
}

const getManifest = async (handle) => {
  const manifestHandle = await handle.getFileHandle('extension.json')
  const manifestFile = await manifestHandle.getFile()
  const content = await manifestFile.text()
  const manifest = JSON.parse(content)
  if (!manifest || typeof manifest !== 'object') {
    throw new TypeError('Extension manifest must be an object')
  }
  if (typeof manifest.id !== 'string' || !manifest.id) {
    throw new TypeError('Extension manifest must have an id')
  }
  return manifest
}

const getInstalledExtensionIds = async () => {
  const ids = await LocalStorage.getJson(storageKey)
  if (!Array.isArray(ids)) {
    return []
  }
  return ids.filter((id) => typeof id === 'string' && id)
}

const saveInstalledExtensionId = async (id) => {
  const ids = await getInstalledExtensionIds()
  if (ids.includes(id)) {
    return
  }
  await LocalStorage.setJson(storageKey, [...ids, id])
}

export const installFromDisk = async () => {
  if (Platform.getPlatform() !== PlatformType.Web) {
    return
  }
  try {
    const handle = await FilePicker.showDirectoryPicker({
      mode: 'read',
    })
    const manifest = await getManifest(handle)
    await PersistentFileHandle.addHandle(getHandleKey(manifest.id), handle)
    const extensionUrl = await getExtensionUrl(manifest.id)
    await ExtensionMeta.addWebExtension(extensionUrl)
    await saveInstalledExtensionId(manifest.id)
  } catch (error) {
    if (IsAbortError.isAbortError(error)) {
      return
    }
    throw new VError(error, 'Failed to install extension from disk')
  }
}

export const restore = async () => {
  if (Platform.getPlatform() !== PlatformType.Web) {
    return
  }
  const ids = await getInstalledExtensionIds()
  for (const id of ids) {
    try {
      const extensionUrl = await getExtensionUrl(id)
      await ExtensionMeta.addWebExtension(extensionUrl)
    } catch (error) {
      console.warn(new VError(error, `Failed to restore extension ${id} from disk`))
    }
  }
}
