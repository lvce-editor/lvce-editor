import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const register = async (previewServerId) => {
  await WebViewServer.registerProtocol()
  await WebViewServer.create(previewServerId) // TODO move this up
}
