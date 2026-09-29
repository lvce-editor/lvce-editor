import * as FileSystemProcess from '../FileSystemProcess/FileSystemProcess.ts'

export const targetWebSocket = (): any => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
    type: 'send',
  }
}

export const targetMessagePort = (): any => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any): any => {
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  }
}
