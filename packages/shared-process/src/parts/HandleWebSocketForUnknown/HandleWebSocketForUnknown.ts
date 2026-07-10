import * as DestroySocket from '../DestroySocket/DestroySocket.ts'
import * as Logger from '../Logger/Logger.ts'

export const handleWebSocket = (message: any, handle: any, protocol: any): any => {
  Logger.warn(`[shared-process] unsupported sec-websocket-protocol ${protocol}`)
  DestroySocket.destroySocket(handle)
}
