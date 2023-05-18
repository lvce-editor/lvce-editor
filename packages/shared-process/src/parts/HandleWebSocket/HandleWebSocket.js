import * as Assert from '../Assert/Assert.js'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.js'
import { VError } from '../VError/VError.js'

export const handleWebSocket = async (handle, message) => {
  try {
    Assert.object(message)
    Assert.object(handle)
    const headers = message.headers
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
    try {
      handle.destroy()
    } catch {}
    throw new VError(error, `Failed to connect to websocket`)
  }
}
