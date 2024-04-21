import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const targetWebSocket = async () => {
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.NodeForkedProcess,
  })
  return ipc
}

export const upgradeWebSocket = (handle, message) => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [message],
    transfer: handle,
  }
}

export const targetMessagePort = async () => {
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.ElectronUtilityProcess,
  })
  return ipc
}

export const upgradeMessagePort = (port) => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [],
    transfer: [port],
  }
}
