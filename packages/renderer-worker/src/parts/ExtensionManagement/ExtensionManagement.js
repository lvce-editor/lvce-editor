import * as ExtensionManifestStatus from '../ExtensionManifestStatus/ExtensionManifestStatus.js'
import * as InstallExtension from '../InstallExtension/InstallExtension.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Command from '../Command/Command.js'

export const handleExtensionStatusUpdate = async () => {
  // TODO inform all viewlets
}

export const invalidateExtensionsCache = async () => {
  try {
    await ExtensionHostWorker.invoke('Extensions.invalidateExtensionsCache')
    await Command.execute('Layout.handleExtensionsChanged')
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
    if (Workspace.isTest()) {
      disabledIds = [...disabledIds, id]
    } else {
      await SharedProcess.invoke(/* ExtensionManagement.disable */ 'ExtensionManagement.disable', /* id */ id)
    }
    await invalidateExtensionsCache()
    return undefined
  } catch (error) {
    return error
  }
}

export const enable = async (id) => {
  try {
    if (Workspace.isTest()) {
      disabledIds = disabledIds.filter((existing) => existing !== id)
    } else {
      await SharedProcess.invoke(/* ExtensionManagement.enable */ 'ExtensionManagement.enable', /* id */ id)
    }
    await invalidateExtensionsCache()
    return undefined
  } catch (error) {
    return error
  }
}

export const getAllExtensions = async () => {
  if (Platform.getPlatform() === PlatformType.Web) {
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

let disabledIds = []

export const getExtension2 = async (id) => {
  const extension = await ExtensionHostWorker.invoke('Extensions.getExtension', id)
  if (disabledIds.includes(id)) {
    return {
      ...extension,
      disabled: true,
    }
  }
  // console.log({ extension, disabledIds, platform: Platform.getPlatform() })
  return extension
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
