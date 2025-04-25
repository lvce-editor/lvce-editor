import * as FileSystemProcess from '../FileSystemProcess/FileSystemProcess.js'

export const targetWebSocket = () => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeWebSocket = (handle, message) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}

export const targetMessagePort = () => {
  return FileSystemProcess.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}
