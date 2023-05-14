import * as Assert from '../Assert/Assert.js'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as GetWsUrl from '../GetWsUrl/GetWsUrl.js'
import * as Json from '../Json/Json.js'
import * as WaitForWebSocketToBeOpen from '../WaitForWebSocketToBeOpen/WaitForWebSocketToBeOpen.js'

export const create = async ({ protocol }) => {
  Assert.string(protocol)
  // TODO replace this during build
  const wsUrl = GetWsUrl.getWsUrl()
  const webSocket = new WebSocket(wsUrl, [protocol])
  const { type, event } = await WaitForWebSocketToBeOpen.waitForWebSocketToBeOpen(webSocket)
  if (type === FirstWebSocketEventType.Close) {
    throw new IpcError(`Failed to create websocket connection: Websocket connection was closed`)
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
            const message = Json.parse(event.data)
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
