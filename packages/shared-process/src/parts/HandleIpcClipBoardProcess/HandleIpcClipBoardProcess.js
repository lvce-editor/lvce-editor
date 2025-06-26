import * as ClipBoardProcess from '../ClipBoardProcess/ClipBoardProcess.js'

export const targetWebSocket = () => {
  return ClipBoardProcess.getOrCreate()
}

export const upgradeWebSocket = (handle, message) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}

export const targetMessagePort = () => {
  return ClipBoardProcess.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}
