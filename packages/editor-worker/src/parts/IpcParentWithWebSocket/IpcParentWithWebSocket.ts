import * as Assert from '../Assert/Assert.ts'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstWebSocketEvent from '../GetFirstWebSocketEvent/GetFirstWebSocketEvent.ts'
import * as GetWebSocketUrl from '../GetWebSocketUrl/GetWebSocketUrl.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as Json from '../Json/Json.ts'
import { VError } from '../VError/VError.ts'

export const create = async ({ type }: { type: string }) => {
  Assert.string(type)
  const wsUrl = GetWebSocketUrl.getWsUrl(type)
  const webSocket = new WebSocket(wsUrl)
  const firstWebSocketEvent = await GetFirstWebSocketEvent.waitForWebSocketToBeOpen(webSocket)
  if (firstWebSocketEvent.type === FirstWebSocketEventType.Error) {
    throw new IpcError(`WebSocket connection error`)
  }
  if (firstWebSocketEvent.type === FirstWebSocketEventType.Close) {
    throw new IpcError(`Websocket connection was closed`)
  }
  return webSocket
}

export const wrap = (webSocket: any) => {
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
        // @ts-ignore
        this.handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = JSON.parse(event.data)
            // @ts-ignore
            listener(message)
          } else {
            // @ts-ignore
            listener(event)
          }
        }
      } else {
        // @ts-ignore
        this.handleMessage = null
      }
      this.webSocket.onmessage = this.handleMessage
    },
    send(message: any) {
      if (this.webSocket.readyState !== webSocket.OPEN) {
        // @ts-ignore
        throw new VError(`Failed to send message: WebSocket is not open`)
      }
      const stringifiedMessage = Json.stringifyCompact(message)
      this.webSocket.send(stringifiedMessage)
    },
  }
}
