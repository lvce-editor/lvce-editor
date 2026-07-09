import * as ClipBoardProcess from '../ClipBoardProcess/ClipBoardProcess.ts'

export const targetWebSocket = (): any => {
  return ClipBoardProcess.getOrCreate()
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}

export const targetMessagePort = (): any => {
  return ClipBoardProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any): any => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}
