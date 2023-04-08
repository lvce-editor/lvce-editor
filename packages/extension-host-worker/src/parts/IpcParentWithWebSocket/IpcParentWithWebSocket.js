import * as Assert from '../Assert/Assert.js'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as Json from '../Json/Json.js'
import { VError } from '../VError/VError.js'
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
  return {
    /**
     * @type {any}
     */
    handleMessage: undefined,
    webSocket,
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        this.handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = JSON.parse(event.data)
            listener(message)
          } else {
            listener(event)
          }
        }
      } else {
        this.handleMessage = null
      }
      this.webSocket.onmessage = this.handleMessage
    },
    send(message) {
      if (this.webSocket.readyState !== webSocket.OPEN) {
        throw new VError(`Failed to send message: WebSocket is not open`)
      }
      const stringifiedMessage = Json.stringifyCompact(message)
      this.webSocket.send(stringifiedMessage)
    },
  }
}
