import * as Json from '../Json/Json.js'

export const createWebSocketIpc = (webSocket) => {
  return {
    send(message) {
      const stringifiedMessage = Json.stringify(message)
      webSocket.send(stringifiedMessage)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          const wrappedListener = (message) => {
            const parsed = Json.parse(message.toString())
            listener(parsed)
          }
          webSocket.on('message', wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
