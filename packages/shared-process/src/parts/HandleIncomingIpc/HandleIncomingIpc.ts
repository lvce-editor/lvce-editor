import * as ApplyIncomingIpcResponse from '../ApplyIncomingIpcResponse/ApplyIncomingIpcResponse.ts'
import * as Assert from '../Assert/Assert.ts'
import * as HandleIncomingIpcMessagePort from '../HandleIncomingIpcMessagePort/HandleIncomingIpcMessagePort.ts'
import * as HandleIncomingIpcWebSocket from '../HandleIncomingIpcWebSocket/HandleIncomingIpcWebSocket.ts'
import * as HandleIpcModule from '../HandleIpcModule/HandleIpcModule.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.ts'
import * as IsSocket from '../IsSocket/IsSocket.ts'
import * as ProcessExplorer from '../ProcessExplorer/ProcessExplorer.ts'

const strinfyHandle = (handle: any): any => {
  if (!handle) {
    return `${handle}`
  }
  console.log({ handle })
  if (handle.constructor && handle.constructor.name) {
    return `${handle.constructor.name}`
  }
  return `${handle}`
}

const getIpcAndResponse = (module: any, handle: any, message: any): any => {
  if (IsMessagePortMain.isMessagePortMain(handle)) {
    return HandleIncomingIpcMessagePort.handleIncomingIpcMessagePort(module, handle, message)
  }
  if (IsSocket.isSocket(handle)) {
    return HandleIncomingIpcWebSocket.handleIncomingIpcWebSocket(module, handle, message)
  }
  throw new Error(`Unexpected ipc handle: ${strinfyHandle(handle)}`)
}

export const handleIncomingIpc = async (ipcId: any, handle: any, message: any): Promise<any> => {
  Assert.number(ipcId)
  const module = HandleIpcModule.getModule(ipcId)
  const { response, target } = await getIpcAndResponse(module, handle, message)
  const error = await ApplyIncomingIpcResponse.applyIncomingIpcResponse(target, response, ipcId)
  if (!error) {
    return
  }
  if (ipcId === IpcId.ProcessExplorer) {
    ProcessExplorer.decreaseRefCount()
  }
  console.error(error)
}
