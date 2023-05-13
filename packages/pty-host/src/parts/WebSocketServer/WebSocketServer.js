import { Buffer } from 'node:buffer'
import * as _ws from 'ws'

// workaround for jest or node bug
const WebSocketServer = _ws.WebSocketServer
  ? _ws.WebSocketServer
  : // @ts-ignore
    _ws.default.WebSocketServer

const webSocketServer = new WebSocketServer({
  noServer: true,

  // TODO not sure if ws compress is working at all
  // perMessageDeflate: true
})

const handleSocket = (socket) => {
  console.log({ socket })
}

// webSocketServer.on('connection', handleSocket)

export const handleUpgrade = (request, socket) => {
  const upgradeCallback = (ws) => {
    //   webSocketServer.emit('connection', ws, request)
  }
  webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), upgradeCallback)
}
