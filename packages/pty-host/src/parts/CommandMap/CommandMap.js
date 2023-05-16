import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as HandleNodeMessagePort from '../HandleNodeMessagePort/HandleNodeMessagePort.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'
import * as PtyController from '../PtyController/PtyController.js'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'HandleNodeMessagePort.handleNodeMessagePort': HandleNodeMessagePort.handleNodeMessagePort,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'Terminal.create': PtyController.create,
  'Terminal.write': PtyController.write,
}
