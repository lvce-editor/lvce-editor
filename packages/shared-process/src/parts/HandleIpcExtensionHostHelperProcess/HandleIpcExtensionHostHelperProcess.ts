import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const targetWebSocket = async (): Promise<any> => {
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.NodeForkedProcess,
  })
  return ipc
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
    type: 'send',
  }
}

export const targetMessagePort = async (): Promise<any> => {
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.ElectronUtilityProcess,
  })
  return ipc
}

export const upgradeMessagePort = (port: any): any => {
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  }
}
