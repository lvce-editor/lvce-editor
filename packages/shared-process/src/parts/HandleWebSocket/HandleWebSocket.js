import * as Assert from '../Assert/Assert.js'
import * as DestroyWebSocket from '../DestroySocket/DestroySocket.js'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.js'
import { VError } from '../VError/VError.js'

export const handleWebSocket = async (message, handle) => {
  try {
    Assert.object(message)
    Assert.object(handle)
    const { headers } = message
    if (!headers) {
      throw new VError('missing websocket headers')
    }
    const protocol = headers['sec-websocket-protocol']
    if (!protocol) {
      throw new VError('missing sec websocket protocol header')
    }
    handle.pause()
    const module = await HandleWebSocketModule.load(protocol)
    await module.handleWebSocket(message, handle, protocol)
    handle.resume()
  } catch (error) {
    DestroyWebSocket.destroySocket(handle)
    throw new VError(error, `Failed to connect to websocket`)
  }
}
