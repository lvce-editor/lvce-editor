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
    method: 'HandleElectronMessagePort.handleTerminalMessagePort',
    params: [port],
    type: 'send',
  }
}

const connect = async (handle: any, message: any, webSocket: boolean): Promise<any> => {
  const lease = PtyHost.acquire(webSocket ? IpcParentType.NodeForkedProcess : IpcParentType.ElectronUtilityProcess)
  const forwarding = PtyHost.acquire(webSocket ? IpcParentType.NodeForkedProcess : IpcParentType.ElectronUtilityProcess)
  try {
    const target = await lease.promise
    const response = webSocket ? upgradeWebSocket(handle, message) : upgradeMessagePort(handle)
    response.params.push(lease.id)
    return {
      complete: () => PtyHost.release(forwarding.id),
      release: () => PtyHost.release(lease.id),
      response,
      target,
    }
  } catch (error) {
    PtyHost.release(lease.id)
    PtyHost.release(forwarding.id)
    throw error
  }
}

export const connectMessagePort = (handle: any, message: any): Promise<any> => connect(handle, message, false)
export const connectWebSocket = (handle: any, message: any): Promise<any> => connect(handle, message, true)
