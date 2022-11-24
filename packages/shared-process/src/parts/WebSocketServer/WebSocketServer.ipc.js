import * as WebSocketServer from './WebSocketServer.js'

export const name = 'WebSocketServer'

export const Commands = {
  handleUpgrade: WebSocketServer.handleUpgrade,
}
