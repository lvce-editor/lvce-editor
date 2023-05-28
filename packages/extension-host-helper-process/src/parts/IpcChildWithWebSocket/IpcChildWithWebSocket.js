import { once } from 'events'
import { IpcError } from '../IpcError/IpcError.js'
import * as IsSocket from '../IsSocket/IsSocket.js'
import * as Json from '../Json/Json.js'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'

export const listen = async () => {
  const [message, handle] = await once(process, 'message')
  if (!IsSocket.isSocket(handle)) {
    throw new IpcError(`socket must be of type Socket`)
  }
  const webSocket = await WebSocketServer.handleUpgrade(message, handle)
  return webSocket
}

export const wrap = (webSocket) => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    send(message) {
      const stringifiedMessage = Json.stringify(message)
      this.webSocket.send(stringifiedMessage)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          this.wrappedListener = (message) => {
            const parsed = Json.parse(message.toString())
            listener(parsed)
          }
          this.webSocket.on('message', this.wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
    off(event, listener) {
      switch (event) {
        case 'message':
          this.webSocket.off('message', this.wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
