import * as PtyHost from '../PtyHost/PtyHost.js'

export const targetWebSocket = () => {
  return PtyHost.getOrCreate()
}

export const upgradeWebSocket = (message, handle) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [message],
    transfer: handle,
  }
}

export const targetMessagePort = () => {
  return PtyHost.getOrCreate()
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
