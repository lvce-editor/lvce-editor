import * as SearchProcess from '../SearchProcess/SearchProcess.ts'

export const targetWebSocket = (): any => {
  return SearchProcess.getOrCreate()
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
    type: 'send',
  }
}

export const targetMessagePort = (): any => {
  return SearchProcess.getOrCreate()
}

export const upgradeMessagePort = (port: any): any => {
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  }
}
