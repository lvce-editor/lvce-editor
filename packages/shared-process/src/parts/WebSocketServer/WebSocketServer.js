import { Buffer } from 'node:buffer'
import * as _ws from 'ws'
import * as Socket from '../Socket/Socket.js'

// workaround for jest or node bug
const WebSocketServer = _ws.WebSocketServer
  ? _ws.WebSocketServer
  : // @ts-ignore
    _ws.default.WebSocketServer

const encode = (commandId, callbackId) => (commandId << 16) | callbackId
const decodeCommand = (encodedCommand) => encodedCommand >> 16
const decodeCallback = (encodedCommand) => encodedCommand & 0x0000FFFF

// console.log('ws', _ws)
// console.log('server', ws.WebSocketServer)

const webSocketServer = new WebSocketServer({
  noServer: true,

  // TODO not sure if ws compress is working at all
  // perMessageDeflate: true
})

// TODO should not import command directly -> Websocket server should be independent of business logic

const handleSocket = (socket) => {
  Socket.set(socket)
}

webSocketServer.on('connection', handleSocket)

export const handleUpgrade = (request, socket) => {
  const upgradeCallback = (ws) => {
    webSocketServer.emit('connection', ws, request)
  }
  webSocketServer.handleUpgrade(
    request,
    socket,
    Buffer.alloc(0),
    upgradeCallback
  )
}
