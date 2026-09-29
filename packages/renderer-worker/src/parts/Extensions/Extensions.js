import { assetDir } from '../AssetDir/AssetDir.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as OpenNativeFolder from '../OpenNativeFolder/OpenNativeFolder.js'
import { getPlatform } from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const openExtensionsFolder = async () => {
  const extensionsFolder = await PlatformPaths.getExtensionsPath()
  await OpenNativeFolder.openNativeFolder(extensionsFolder)
}

export const openCachedExtensionsFolder = async () => {
  const cachedExtensionsFolder = await PlatformPaths.getCachedExtensionsPath()
  await OpenNativeFolder.openNativeFolder(cachedExtensionsFolder)
}

const applyViewRenderResult = async (uid, result) => {
  if (result?.type === 'setDom') {
    await RendererProcess.invoke('Viewlet.setDom2', uid, result.dom || [])
  }
  if (result?.type === 'setPatches') {
    await RendererProcess.invoke('Viewlet.setPatches', uid, result.patches || [])
  }
  return result
}

export const createViewInstance = async (viewId, uid, context) => {
  const result = await ExtensionManagementWorker.invoke('Extensions.createViewInstance', viewId, uid, context, assetDir, getPlatform())
  if (result?.ok === false) {
    return result
  }
  if (result?.ok === true) {
    return applyViewRenderResult(uid, result.result)
  }
  return applyViewRenderResult(uid, result)
}

export const dispatchViewEvent = async (viewId, uid, event) => {
  const result = await ExtensionManagementWorker.invoke('Extensions.dispatchViewEvent', viewId, uid, event, assetDir, getPlatform())
  return applyViewRenderResult(uid, result)
}

export const disposeViewInstance = async (viewId, uid) => {
  await ExtensionManagementWorker.invoke('Extensions.disposeViewInstance', viewId, uid, assetDir, getPlatform())
}

export const saveViewInstanceState = async (viewId, uid) => {
  return ExtensionManagementWorker.invoke('Extensions.saveViewInstanceState', viewId, uid, assetDir, getPlatform())
}
