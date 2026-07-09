import * as PtyHost from '../PtyHost/PtyHost.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const targetWebSocket = (): any => {
  return PtyHost.getOrCreate(IpcParentType.NodeForkedProcess)
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    type: 'send',
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
  }
}

export const targetMessagePort = (): any => {
  return PtyHost.getOrCreate(IpcParentType.ElectronUtilityProcess)
}

export const upgradeMessagePort = (port: any): any => {
  return {
    type: 'send',
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
  }
}
