import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const start = async (webViewPort, frameAncestors, webViewRoot) => {
  await SharedProcess.invoke('WebViewServer.start', webViewPort, frameAncestors, webViewRoot)
}
