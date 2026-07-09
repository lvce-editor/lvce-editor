import * as Logger from '../Logger/Logger.ts'
import * as DestroySocket from '../DestroySocket/DestroySocket.ts'

export const handleWebSocket = (message: any, handle: any, protocol: any): any => {
  Logger.warn(`[shared-process] unsupported sec-websocket-protocol ${protocol}`)
  DestroySocket.destroySocket(handle)
}
