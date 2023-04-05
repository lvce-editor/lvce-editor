import * as Assert from '../Assert/Assert.js'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as Json from '../Json/Json.js'
import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

const getWsUrl = () => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}`
}

export const create = async ({ protocol }) => {
  Assert.string(protocol)
  // TODO replace this during build
  const wsUrl = getWsUrl()
  const webSocket = new WebSocket(wsUrl, [protocol])
  const { type, event } = await GetFirstWebSocketEvent.waitForWebSocketToBeOpen(webSocket)
  if (type === FirstWebSocketEventType.Error) {
    throw new IpcError(`WebSocket connection error`)
  }
  if (type === FirstWebSocketEventType.Close) {
    throw new IpcError(`Websocket connection was closed`)
  }
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
