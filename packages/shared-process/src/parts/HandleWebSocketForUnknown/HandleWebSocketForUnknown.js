import * as Logger from '../Logger/Logger.js'

export const handleWebSocket = (message, handle, protocol) => {
  Logger.warn(`[shared-process] unsupported sec-websocket-procotol ${protocol}`)
  try {
    handle.destroy()
  } catch {
    // ignore
  }
}
