import * as Logger from '../Logger/Logger.js'
import * as DestroySocket from '../DestroySocket/DestroySocket.js'

export const handleWebSocket = (message, handle, protocol) => {
  Logger.warn(`[shared-process] unsupported sec-websocket-protocol ${protocol}`)
  DestroySocket.destroySocket(handle)
}
