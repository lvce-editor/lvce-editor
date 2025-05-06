import * as Assert from '../Assert/Assert.js'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const targetWebSocket = async (handle, message) => {
  handle.on('error', HandleSocketError.handleSocketError)
  const rpc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request: message,
    handle,
  })
  return rpc
}

export const upgradeWebSocket = () => {
  return {
    type: 'handle',
  }
}

export const targetMessagePort = async (messagePort, message) => {
  Assert.object(messagePort)
  const rpc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  if (message.ipcId === IpcId.MainProcess) {
    // update ipc with message port ipc that supports transferring objects
    // @ts-ignore
    ParentIpc.state.rpc = rpc
  }
  // TODO find better way to associate configuration with ipc
  // @ts-ignore
  rpc.windowId = message.windowId
  return rpc
}

export const upgradeMessagePort = () => {
  return {
    type: 'handle',
  }
}
