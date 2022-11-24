import * as _ws from 'ws'

export const getWebSocket = async (message, handle) => {
  // workaround for jest or node bug
  const WebSocketServer = _ws.WebSocketServer
    ? _ws.WebSocketServer
    : // @ts-ignore
      _ws.default.WebSocketServer

  const webSocketServer = new WebSocketServer({
    noServer: true,
  })
  const webSocket = await new Promise((resolve, reject) => {
    const upgradeCallback = (webSocket) => {
      resolve(webSocket)
    }
    webSocketServer.handleUpgrade(
      message,
      handle,
      Buffer.alloc(0),
      upgradeCallback
    )
  })
  return webSocket
}
