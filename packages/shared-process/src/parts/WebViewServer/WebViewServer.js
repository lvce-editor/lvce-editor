import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'

export const create = async (previewId) => {
  await PreviewProcess.invoke('WebViewServer.create', previewId)
}

export const start = async (previewId, port) => {
  await PreviewProcess.invoke('WebViewServer.start', previewId, port)
}

export const setHandler = async (previewId, frameAncestors, webViewRoot) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', previewId, frameAncestors, webViewRoot)
}
