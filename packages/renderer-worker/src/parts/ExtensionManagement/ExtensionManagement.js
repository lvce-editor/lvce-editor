import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as InstallExtension from '../InstallExtension/InstallExtension.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'

export const handleExtensionStatusUpdate = async () => {
  // TODO inform all viewlets
}

export const install = (id) => {
  return InstallExtension.install(id)
}

export const uninstall = (id) => {
  return SharedProcess.invoke(/* ExtensionManagement.uninstall */ 'ExtensionManagement.uninstall', /* id */ id)
}

export const disable = async (id) => {
  try {
    return SharedProcess.invoke(/* ExtensionManagement.disable */ 'ExtensionManagement.disable', /* id */ id)
  } catch (error) {
    return error
  }
}

export const enable = async (id) => {
  try {
    return await SharedProcess.invoke(/* ExtensionManagement.enable */ 'ExtensionManagement.enable', /* id */ id)
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
