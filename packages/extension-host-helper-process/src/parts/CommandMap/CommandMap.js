import * as Ajax from '../Ajax/Ajax.js'
import * as Exec from '../Exec/Exec.js'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'
import * as LoadFile from '../LoadFile/LoadFile.js'

export const commandMap = {
  'Exec.exec': Exec.exec,
  'Ajax.getJson': Ajax.getJson,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'LoadFile.loadFile': LoadFile.loadFile,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
