import * as WebViewServer from '../WebViewServer/WebViewServer.ts'

export const name = 'WebViewServer'

export const Commands = {
  create: WebViewServer.create,
  registerProtocol: WebViewServer.registerProtocol,
  setHandler: WebViewServer.setHandler,
  setInfo: WebViewServer.setInfo,
  setInfo2: WebViewServer.setInfo2,
  start: WebViewServer.start,
}
