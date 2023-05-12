import * as PtyController from '../PtyController/PtyController.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'

export const getFn = (method) => {
  switch (method) {
    case 'Terminal.create':
      return PtyController.create
    case 'Terminal.write':
      return PtyController.write
    case 'HandleWebSocket.handleWebSocket':
      return HandleWebSocket.handleWebSocket
    default:
      throw new Error(`command not found ${method}`)
  }
}
