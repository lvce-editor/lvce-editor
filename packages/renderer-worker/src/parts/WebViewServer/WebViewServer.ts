import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const start = async (webViewPort) => {
  await SharedProcess.invoke('WebViewServer.start', webViewPort)
}

export const setHandler = async (frameAncestors, webViewRoot) => {
  await SharedProcess.invoke('WebViewServer.setHandler', frameAncestors, webViewRoot)
}
