import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as InstallExtension from '../InstallExtension/InstallExtension.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const handleExtensionStatusUpdate = async () => {
  // TODO inform all viewlets
}

const invalidateExtensionsCache = async () => {
  try {
    await ExtensionHostWorker.invoke('Extensions.invalidateExtensionsCache')
  } catch {
    // ignore
  }
}

export const install = async (id) => {
  await InstallExtension.install(id)
  invalidateExtensionsCache()
}

export const uninstall = async (id) => {
  await SharedProcess.invoke(/* ExtensionManagement.uninstall */ 'ExtensionManagement.uninstall', /* id */ id)
  invalidateExtensionsCache()
}

export const disable = async (id) => {
  try {
    await SharedProcess.invoke(/* ExtensionManagement.disable */ 'ExtensionManagement.disable', /* id */ id)
    await invalidateExtensionsCache()
    return undefined
  } catch (error) {
    return error
  }
}

export const enable = async (id) => {
  try {
    await SharedProcess.invoke(/* ExtensionManagement.enable */ 'ExtensionManagement.enable', /* id */ id)
    await invalidateExtensionsCache()
    return undefined
  } catch (error) {
    return error
  }
}

export const getAllExtensions = async () => {
  if (Platform.platform === PlatformType.Web) {
    return []
  }
  return SharedProcess.invoke(/* ExtensionManagement.getAllExtensions */ 'ExtensionManagement.getAllExtensions')
}

export const getExtension = async (id) => {
  const allExtensions = await getAllExtensions()
  for (const extension of allExtensions) {
    if (extension.id === id) {
      return extension
    }
  }
  return undefined
}

export const getExtension2 = async (id) => {
  return ExtensionHostWorker.invoke('Extensions.getExtension', id)
}

const isFulfilled = (result) => {
  return result.status === ExtensionManifestStatus.Resolved
}

const getValue = (result) => {
  return result.value
}

export const getWorkingExtensions = async () => {
  const allExtensions = await getAllExtensions()
  // @ts-ignore
  const fullFilledExtensions = allExtensions.filter(isFulfilled).map(getValue)
}

export const getExtensionsEtag = async () => {
  const etag = await SharedProcess.invoke('ExtensionManagement.getExtensionsEtag')
  return etag
}
