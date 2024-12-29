import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'
import * as RegisterWebViewProtocol from '../RegisterWebViewProtocol/RegisterWebViewProtocol.js'

export const registerProtocol = RegisterWebViewProtocol.registerWebViewProtocol

export const create = async (...args) => {
  await PreviewProcess.invoke('WebViewServer.create', ...args)
}

export const start = async (previewId, port) => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot, contentSecurityPolicy, iframeContent)
}

export const setInfo = async (...args) => {
  await PreviewProcess.invoke('WebViewServer.setInfo', ...args)
}

export const setInfo2 = async (...args) => {
  await PreviewProcess.invoke('WebViewServer.setInfo2', ...args)
}
