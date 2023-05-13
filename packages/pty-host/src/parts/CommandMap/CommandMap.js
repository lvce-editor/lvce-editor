import * as PtyController from '../PtyController/PtyController.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'

export const commandMap = {
  'Terminal.create': PtyController.create,
  'Terminal.write': PtyController.write,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
}
