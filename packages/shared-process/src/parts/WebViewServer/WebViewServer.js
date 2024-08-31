import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const registerProtocol = async () => {
  // TODO only do this once
  // TODO send messageport to proview process
  // TODO send other messageport to parent process
  await ParentIpc.invoke('ElectronSession.registerWebviewProtocol')
}

export const create = async (previewId) => {
  console.log('create webview server')
  await PreviewProcess.invoke('WebViewServer.create', previewId)
}

export const start = async (previewId, port) => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (previewId, frameAncestors, webViewRoot) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot)
}
