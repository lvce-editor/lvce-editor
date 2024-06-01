import * as PtyHost from '../PtyHost/PtyHost.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const targetWebSocket = () => {
  return PtyHost.getOrCreate(IpcParentType.NodeForkedProcess)
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
  return PtyHost.getOrCreate(IpcParentType.ElectronUtilityProcess)
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
