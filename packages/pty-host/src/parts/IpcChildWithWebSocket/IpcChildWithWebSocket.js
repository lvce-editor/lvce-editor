import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsWebSocket from '../IsWebSocket/IsWebSocket.js'
import * as IsWebSocketOpen from '../IsWebSocketOpen/IsWebSocketOpen.js'
import * as WebSocketSerialization from '../WebSocketSerialization/WebSocketSerialization.js'

export const listen = async ({ webSocket }) => {
  if (!webSocket) {
    throw new IpcError('webSocket must be defined')
  }
  if (!IsWebSocket.isWebSocket(webSocket)) {
    throw new IpcError(`webSocket must be of type WebSocket`)
  }
  if (!IsWebSocketOpen.isWebSocketOpen(webSocket)) {
    const { type, event } = await GetFirstWebSocketEvent.getFirstWebSocketEvent(webSocket)
    console.log({ type, event })
  }
  return webSocket
}

export const wrap = (webSocket) => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    on(event, listener) {
      switch (event) {
        case 'message':
          const wrappedListener = (message) => {
            const data = WebSocketSerialization.deserialize(message)
            listener(data)
          }
          webSocket.on('message', wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
    off(event, listener) {
      this.webSocket.off(event, listener)
    },
    send(message) {
      const stringifiedMessage = WebSocketSerialization.serialize(message)
      this.webSocket.send(stringifiedMessage)
    },
    dispose() {
      this.webSocket.close()
    },
    start() {
      this.webSocket.resume()
    },
  }
}
