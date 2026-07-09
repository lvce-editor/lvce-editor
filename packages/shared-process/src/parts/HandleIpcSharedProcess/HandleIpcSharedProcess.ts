import * as Assert from '../Assert/Assert.ts'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const targetWebSocket = async (handle: any, message: any): Promise<any> => {
  handle.on('error', HandleSocketError.handleSocketError)
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request: message,
    handle,
  })
  return ipc
}

export const upgradeWebSocket = (): any => {
  return {
    type: 'handle',
  }
}

export const targetMessagePort = async (messagePort: any, message: any): Promise<any> => {
  Assert.object(messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  if (message.ipcId === IpcId.MainProcess) {
    // update ipc with message port ipc that supports transferring objects
    // @ts-ignore
    ParentIpc.state.ipc = ipc
  }
  // TODO find better way to associate configuration with ipc
  // @ts-ignore
  ipc.windowId = message.windowId
  return ipc
}

export const upgradeMessagePort = (): any => {
  return {
    type: 'handle',
  }
}
