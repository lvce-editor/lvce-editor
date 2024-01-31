import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.js'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.js'
import * as LoadFile from '../LoadFile/LoadFile.js'

export const commandMap = {
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'LoadFile.loadFile': LoadFile.loadFile,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
