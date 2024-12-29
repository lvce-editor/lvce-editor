import * as WebViewServer from '../WebViewServer/WebViewServer.js'

export const name = 'WebViewServer'

export const Commands = {
  start: WebViewServer.start,
  create: WebViewServer.create,
  setHandler: WebViewServer.setHandler,
  registerProtocol: WebViewServer.registerProtocol,
  setInfo: WebViewServer.setInfo,
  setInfo2: WebViewServer.setInfo2,
}
