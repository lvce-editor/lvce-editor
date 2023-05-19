import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.js'
import * as IsWebSocketOpen from '../IsWebSocketOpen/IsWebSocketOpen.js'

export const listen = async ({ webSocket }) => {
  if (!IsWebSocketOpen.isWebSocketOpen(webSocket)) {
    const { type, event } = await GetFirstWebSocketEvent.getFirstWebSocketEvent(webSocket)
    console.log({ type, event })
  }
  return webSocket
}

const getActualData = (message) => {
  const data = JSON.parse(message.toString())
  return data
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
            const data = getActualData(message)
            listener(data)
          }
          webSocket.on('message', wrappedListener)
          break
        case 'close':
          webSocket.on('close', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
    off(event, listener) {
      this.webSocket.off(event, listener)
    },
    send(message) {
      const stringifiedMessage = JSON.stringify(message)
      this.webSocket.send(stringifiedMessage)
    },
    dispose() {
      this.webSocket.close()
    },
  }
}
