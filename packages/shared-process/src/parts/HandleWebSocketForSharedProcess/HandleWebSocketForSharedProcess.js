import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const handleWebSocket = (message, handle) => {
  // TODO when it is an extension host websocket, spawn extension host
  handle.on('error', (error) => {
    if (error && error.code === ErrorCodes.ECONNRESET) {
      return
    }
    console.info('[info shared process: handle error]', error)
  })
  Command.execute(/* WebSocketServer.handleUpgrade */ 'WebSocketServer.handleUpgrade', /* message */ message, /* handle */ handle)
}
