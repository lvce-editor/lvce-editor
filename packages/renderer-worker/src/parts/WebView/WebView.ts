import * as AssetDir from '../AssetDir/AssetDir.js'
import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as GetEditorProviders from '../GetEditorProviders/GetEditorProviders.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as IframeWorker from '../IframeWorker/IframeWorker.js'
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
  return getWebViewInfo2(providerId)
}

export const getWebViewInfo2 = (providerId: string) => {
  return GetWebViews.getWebViews().then((webViews) => webViews.find((webView) => webView.id === providerId))
}

export const getEditorProviders = (): Promise<readonly unknown[]> => {
  return GetEditorProviders.getEditorProviders()
}

export const create3 = async (uri: string, id: number): Promise<void> => {
  await IframeWorker.invoke('WebView.create3', {
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
  await IframeWorker.invokeAndTransfer('WebView.registerInterceptor', id, port)
}

export const unregisterInterceptor = async (id: number): Promise<void> => {
  await IframeWorker.invoke('WebView.unregisterInterceptor', id)
}

export const getRpcInfo = (rpcId: string): Promise<any> => {
  return ExtensionManagementWorker.invoke('Extensions.getRpcInfo', rpcId)
}

export const createWebViewWorkerRpc2 = (rpcInfo: any, port: MessagePort): Promise<void> => {
  return ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc2', rpcInfo, port)
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
    const [method, ...params] = args
    if (method === 'WebView.createWebViewWorkerRpc2') {
      return createWebViewWorkerRpc2(params[0], params[1])
    }
    throw new Error(`Unsupported legacy extension host transfer command: ${method}`)
  },
  extensionHostWorkerInvoke(...args) {
    const [method, ...params] = args
    if (method === 'WebView.getRpcInfo') {
      return getRpcInfo(params[0])
    }
    throw new Error(`Unsupported legacy extension host command: ${method}`)
  },
  getWebViews() {
    return GetWebViews.getWebViews()
  },
  getSavedState() {
    return ExtensionHostState.getSavedState()
  },
}
