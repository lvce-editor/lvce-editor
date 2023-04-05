import { once } from 'events'
import * as CreateWebSocketIpc from '../CreateWebSocketIpc/CreateWebSocketIpc.js'
import * as GetWebSocket from '../GetWebSocket/GetWebSocket.js'

export const listen = async () => {
  const [message, handle] = await once(process, 'message')
  const webSocket = await GetWebSocket.getWebSocket(message, handle)
  const ipc = CreateWebSocketIpc.createWebSocketIpc(webSocket)
  return ipc
}
