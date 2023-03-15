import * as Json from '../Json/Json.js'
import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js'

const getWsUrl = () => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}`
}

export const create = async ({ protocol }) => {
  // TODO replace this during build
  const wsUrl = getWsUrl()
  const webSocket = new WebSocket(wsUrl, [protocol])
  await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  return webSocket
}

export const wrap = (webSocket) => {
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = JSON.parse(event.data)
            listener(message)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      webSocket.onmessage = handleMessage
    },
    send(message) {
      const stringifiedMessage = Json.stringifyCompact(message)
      webSocket.send(stringifiedMessage)
    },
  }
}
