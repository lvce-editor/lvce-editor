import * as SearchProcess from '../SearchProcess/SearchProcess.js'

export const targetWebSocket = () => {
  return SearchProcess.getOrCreate()
}

export const upgradeWebSocket = (handle, message) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [message],
    transfer: handle,
  }
}

export const targetMessagePort = () => {
  return SearchProcess.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
