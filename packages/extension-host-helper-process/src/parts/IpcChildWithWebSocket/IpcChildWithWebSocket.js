import { once } from 'events'
import * as GetWebSocket from '../GetWebSocket/GetWebSocket.js'
import * as Json from '../Json/Json.js'

export const listen = async () => {
  const [message, handle] = await once(process, 'message')
  const webSocket = await GetWebSocket.getWebSocket(message, handle)
  return webSocket
}

export const wrap = (webSocket) => {
  return {
    webSocket,
    send(message) {
      const stringifiedMessage = Json.stringify(message)
      this.webSocket.send(stringifiedMessage)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          const wrappedListener = (message) => {
            const parsed = Json.parse(message.toString())
            listener(parsed)
          }
          this.webSocket.on('message', wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
