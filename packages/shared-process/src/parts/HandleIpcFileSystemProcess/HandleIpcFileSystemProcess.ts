import * as FileSystemProcess from '../FileSystemProcess/FileSystemProcess.ts'

export const targetWebSocket = (): any => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}

export const targetMessagePort = (): any => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any): any => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}
