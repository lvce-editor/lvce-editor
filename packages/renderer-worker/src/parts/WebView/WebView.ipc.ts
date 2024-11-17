import * as WebView from '../WebView/WebView.ts'

export const name = 'WebView'

export const Commands = {
  compatExtensionHostWorkerInvoke: WebView.compat.extensionHostWorkerInvoke,
  compatExtensionHostWorkerInvokeAndTransfer: WebView.compat.extensionHostWorkerInvokeAndTransfer,
  compatRendererProcessInvoke: WebView.compat.rendererProcessInvoke,
  compatSharedProcessInvoke: WebView.compat.sharedProcessInvoke,
  setPort: WebView.setPort,
}
