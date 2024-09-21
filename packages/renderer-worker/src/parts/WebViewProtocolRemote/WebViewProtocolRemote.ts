import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const register = async (previewServerId, webViewPort, frameAncestors, webViewRoot, csp, iframeContent) => {
  // TODO apply something similar for electron
  // TODO pass webview root, so that only these resources can be accessed
  // TODO pass csp configuration to server
  // TODO pass coop / coep configuration to server
  await WebViewServer.create(previewServerId) // TODO move this up
  await WebViewServer.start(previewServerId, webViewPort) // TODO move this up
  await WebViewServer.setHandler(previewServerId, frameAncestors, webViewRoot, csp, iframeContent)
  // TODO make this work in gitpod also
}
