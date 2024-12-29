import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const setPort = async (uid: number, port: MessagePort, origin: string, portType: string): Promise<void> => {
  await RendererProcess.invokeAndTransfer('WebView.setPort', uid, port, origin, portType)
}

export const getWebViewInfo = (providerId: string) => {
  return ExtensionHostWorker.invoke('ExtensionHostWebView.getWebViewInfo', providerId)
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
