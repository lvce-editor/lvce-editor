import * as Logger from '../Logger/Logger.ts'
import * as DestroySocket from '../DestroySocket/DestroySocket.ts'

export const handleWebSocket = (message, handle, protocol) => {
  Logger.warn(`[shared-process] unsupported sec-websocket-protocol ${protocol}`)
  DestroySocket.destroySocket(handle)
}
