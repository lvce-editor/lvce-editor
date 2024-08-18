import * as WebViewServer from '../WebViewServer/WebViewServer.js'

export const name = 'WebViewServer'

export const Commands = {
  start: WebViewServer.start,
  setHandler: WebViewServer.setHandler,
}
