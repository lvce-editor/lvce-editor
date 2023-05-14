import * as PtyController from '../PtyController/PtyController.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'

export const commandMap = {
  'Terminal.create': PtyController.create,
  'Terminal.write': PtyController.write,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
