import * as Assert from '../Assert/Assert.js'
import * as DestroyWebSocket from '../DestroySocket/DestroySocket.js'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.js'
import * as GetTypeFromUrl from '../GetTypeFromUrl/GetTypeFromUrl.js'
import { VError } from '../VError/VError.js'

export const handleWebSocket = async (message, handle) => {
  try {
    Assert.object(message)
    Assert.object(handle)
    const { url } = message
    const type = GetTypeFromUrl.getTypeFromUrl(url)
    handle.pause()
    const module = await HandleWebSocketModule.load(type)
    await module.handleWebSocket(message, handle, type)
  } catch (error) {
    DestroyWebSocket.destroySocket(handle)
    throw new VError(error, `Failed to connect to websocket`)
  }
}
