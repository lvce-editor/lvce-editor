import * as Assert from '../Assert/Assert.js'
import * as DestroyWebSocket from '../DestroySocket/DestroySocket.js'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.js'
import * as GetTypeFromUrl from '../GetTypeFromUrl/GetTypeFromUrl.js'
import * as IsAllowedWebSocketOrigin from '../IsAllowedWebSocketOrigin/IsAllowedWebSocketOrigin.js'
import * as RejectWebSocket from '../RejectWebSocket/RejectWebSocket.js'
import { VError } from '../VError/VError.js'

export const handleWebSocket = async (handle, message) => {
  try {
    Assert.object(handle)
    Assert.object(message)
    if (!IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin(message)) {
      RejectWebSocket.rejectWebSocket(handle)
      return
    }
    const { url } = message
    const type = GetTypeFromUrl.getTypeFromUrl(url)
    handle.pause()
    const module = HandleWebSocketModule.load(type)
    module.handleWebSocket(message, handle, type)
  } catch (error) {
    DestroyWebSocket.destroySocket(handle)
    throw new VError(error, `Failed to connect to websocket`)
  }
}
