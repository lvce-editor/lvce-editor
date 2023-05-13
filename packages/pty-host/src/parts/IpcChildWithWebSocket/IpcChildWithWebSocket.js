import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.js'
import * as IsWebSocketOpen from '../IsWebSocketOpen/IsWebSocketOpen.js'

export const listen = async ({ webSocket }) => {
  if (!IsWebSocketOpen.isWebSocketOpen(webSocket)) {
    const { type, event } = await GetFirstWebSocketEvent.getFirstWebSocketEvent(webSocket)
    console.log({ type, event })
  }
  return webSocket
}

class MessageEvent extends Event {
  constructor(data, target) {
    super('message')
    this.data = data
    this.target = target
  }
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
            const data = JSON.parse(message.toString())
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
      this.webSocket.postMessage(message)
    },
    dispose() {
      this.webSocket.close()
    },
  }
}
