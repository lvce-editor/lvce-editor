import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as PtyHost from '../PtyHost/PtyHost.ts'

export const targetWebSocket = (): any => {
  return PtyHost.getOrCreate(IpcParentType.NodeForkedProcess)
}

export const upgradeWebSocket = (handle: any, message: any): any => {
  return {
    method: 'HandleWebSocket.handleWebSocket',
    params: [handle, message],
    type: 'send',
  }
}

export const targetMessagePort = (): any => {
  return PtyHost.getOrCreate(IpcParentType.ElectronUtilityProcess)
}

export const upgradeMessagePort = (port: any): any => {
  return {
    method: 'HandleElectronMessagePort.handleElectronMessagePort',
    params: [port],
    type: 'send',
  }
}
