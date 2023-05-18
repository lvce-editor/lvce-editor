import * as Assert from '../Assert/Assert.js'
import * as HandleWebSocketModule from '../HandleWebSocketModule/HandleWebSocketModule.js'
import { VError } from '../VError/VError.js'

export const handleWebSocket = async (message, handle) => {
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
  try {
    const module = await HandleWebSocketModule.load(protocol)
    await module.handleWebSocket(message, handle, protocol)
  } catch (error) {
    try {
      handle.destroy()
    } catch {}
    throw new VError(error, `Failed to connect to websocket`)
  }
}
