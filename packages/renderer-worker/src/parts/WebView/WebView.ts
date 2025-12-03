import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as IsGitpod from '../IsGitpod/IsGitpod.ts'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Scheme from '../Scheme/Scheme.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const setPort = async (uid: number, port: MessagePort, origin: string, portType: string): Promise<void> => {
  await RendererProcess.invokeAndTransfer('WebView.setPort', uid, port, origin, portType)
}

/**
 * @deprecated
 */
export const getWebViewInfo = (providerId: string) => {
  return ExtensionHostWorker.invoke('ExtensionHostWebView.getWebViewInfo', providerId)
}

export const getWebViewInfo2 = (providerId: string) => {
  return ExtensionHostWorker.invoke('ExtensionHostWebView.getWebViewInfo2', providerId)
}

export const create3 = async (uri: string, id: number): Promise<void> => {
  await ExtensionHostWorker.invoke('WebView.create3', {
    id,
    uri,
    platform: Platform.getPlatform(),
    isGitpod: IsGitpod.isGitpod,
    assetDir: AssetDir.assetDir,
    webViewScheme: Scheme.WebView,
    useNewWebViewHandler: true,
  })
}

export const getSecret = (key: string) => {
  return Preferences.get(key)
}

export const registerInterceptor = async (id: number, port: MessagePort): Promise<void> => {
  await ExtensionHostWorker.invokeAndTransfer('WebView.registerInterceptor', id, port)
}

export const unregisterInterceptor = async (id: number): Promise<void> => {
  await ExtensionHostWorker.invoke('WebView.unregisterInterceptor', id)
}

export const compat = {
  sharedProcessInvoke(...args) {
    return SharedProcess.invoke(...args)
  },
  rendererProcessInvoke(...args) {
    return RendererProcess.invoke(...args)
  },
  rendererProcessInvokeAndTransfer(...args) {
    return RendererProcess.invokeAndTransfer(...args)
  },
  extensionHostWorkerInvokeAndTransfer(...args) {
    return ExtensionHostWorker.invokeAndTransfer(...args)
  },
  extensionHostWorkerInvoke(...args) {
    return ExtensionHostWorker.invoke(...args)
  },
  getWebViews() {
    return GetWebViews.getWebViews()
  },
  getSavedState() {
    return ExtensionHostState.getSavedState()
  },
}
