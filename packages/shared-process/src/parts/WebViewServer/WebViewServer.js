import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'
import * as RegisterWebViewProtocol from '../RegisterWebViewProtocol/RegisterWebViewProtocol.js'

export const registerProtocol = RegisterWebViewProtocol.registerWebViewProtocol

export const create = async (previewId) => {
  await PreviewProcess.invoke('WebViewServer.create', previewId)
}

export const start = async (previewId, port) => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
}

export const setInfo = async (previewId, webViewId, webViewRoot) => {
  // TODO send to preview process
}
