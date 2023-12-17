import * as Assert from '../Assert/Assert.js'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetWsUrl from '../GetWsUrl/GetWsUrl.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as Json from '../Json/Json.js'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js'

export const create = async ({ protocol }) => {
  Assert.string(protocol)
  // TODO replace this during build
  const wsUrl = GetWsUrl.getWsUrl()
  const webSocket = new WebSocket(wsUrl, [protocol])
  const { type, event } = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  if (type === FirstWebSocketEventType.Close) {
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
        listener(message)
      }
      this.webSocket.onmessage = wrappedListener
    },
    send(message) {
      const stringifiedMessage = Json.stringifyCompact(message)
      this.webSocket.send(stringifiedMessage)
    },
  }
}
