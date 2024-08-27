import * as PreviewProcess from '../PreviewProcess/PreviewProcess.js'

export const start = async (port) => {
  await PreviewProcess.invoke('WebViewServer.start', port)
}

export const setHandler = async (frameAncestors, webViewRoot) => {
  await PreviewProcess.invoke('WebViewServer.setHandler', frameAncestors, webViewRoot)
}
