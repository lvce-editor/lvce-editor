import * as Assert from '../Assert/Assert.ts'
import * as DestroyWebSocket from '../DestroySocket/DestroySocket.ts'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.ts'
import * as GetTypeFromUrl from '../GetTypeFromUrl/GetTypeFromUrl.ts'
import * as IsAllowedWebSocketOrigin from '../IsAllowedWebSocketOrigin/IsAllowedWebSocketOrigin.ts'
import * as RejectWebSocket from '../RejectWebSocket/RejectWebSocket.ts'
import { VError } from '../VError/VError.ts'

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
