import * as WebView from '../WebView/WebView.ts'

export const name = 'WebView'

export const Commands = {
  compatExtensionHostWorkerInvoke: WebView.compat.extensionHostWorkerInvoke,
  compatExtensionHostWorkerInvokeAndTransfer: WebView.compat.extensionHostWorkerInvokeAndTransfer,
  compatRendererProcessInvoke: WebView.compat.rendererProcessInvoke,
  compatRendererProcessInvokeAndTransfer: WebView.compat.rendererProcessInvokeAndTransfer,
  compatSharedProcessInvoke: WebView.compat.sharedProcessInvoke,
  getSavedState: WebView.compat.getSavedState,
  getWebViewInfo: WebView.getWebViewInfo,
  getWebViewInfo2: WebView.getWebViewInfo2,
  getWebViews: WebView.compat.getWebViews,
  setPort: WebView.setPort,
  getSecret: WebView.getSecret,
  getRpcInfo: WebView.getRpcInfo,
  createWebViewWorkerRpc2: WebView.createWebViewWorkerRpc2,
  registerInterceptor: WebView.registerInterceptor,
  unregisterInterceptor: WebView.unregisterInterceptor,
}
