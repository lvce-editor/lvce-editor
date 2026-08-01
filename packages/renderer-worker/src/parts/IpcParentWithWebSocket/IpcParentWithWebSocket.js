import * as Assert from '../Assert/Assert.ts'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as Json from '../Json/Json.js'
import * as ReconnectingWebSocket from '../ReconnectingWebSocket/ReconnectingWebSocket.js'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js'
import * as WebSocketCapability from '../WebSocketCapability/WebSocketCapability.js'

export const create = async ({ type }) => {
  Assert.string(type)
  const getConnectionInfo = () => WebSocketCapability.create(type)
  const { protocols, url } = await getConnectionInfo()
  const webSocket = ReconnectingWebSocket.create(url, protocols, getConnectionInfo)
  let firstWebSocketEvent = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  if (firstWebSocketEvent.type === FirstWebSocketEventType.Close) {
    firstWebSocketEvent = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  }
  if (firstWebSocketEvent.type === FirstWebSocketEventType.Close) {
    throw new IpcError('Websocket connection was immediately closed')
  }
  return webSocket
}

const getMessage = (event) => {
  return Json.parse(event.data)
}

export const wrap = (webSocket) => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const message = getMessage(event)
        const syntheticEvent = {
          data: message,
          target: this,
        }
        listener(syntheticEvent)
      }
      this.webSocket.onmessage = wrappedListener
    },
    send(message) {
      const stringifiedMessage = Json.stringifyCompact(message)
      this.webSocket.send(stringifiedMessage)
    },
  }
}
