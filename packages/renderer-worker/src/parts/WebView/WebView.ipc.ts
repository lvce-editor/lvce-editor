import * as WebView from '../WebView/WebView.ts'

export const name = 'WebView'

export const Commands = {
  compatExtensionHostWorkerInvoke: WebView.compat.extensionHostWorkerInvoke,
  compatExtensionHostWorkerInvokeAndTransfer: WebView.compat.extensionHostWorkerInvokeAndTransfer,
  compatRendererProcessInvoke: WebView.compat.rendererProcessInvoke,
  compatRendererProcessInvokeAndTransfer: WebView.compat.rendererProcessInvokeAndTransfer,
  compatSharedProcessInvoke: WebView.compat.sharedProcessInvoke,
  getWebViews: WebView.compat.getWebViews,
  setPort: WebView.setPort,
  getSavedState: WebView.compat.getSavedState,
}
