import * as ApplyIncomingIpcResponse from '../ApplyIncomingIpcResponse/ApplyIncomingIpcResponse.js'
import * as Assert from '../Assert/Assert.js'
import * as HandleIncomingIpcMessagePort from '../HandleIncomingIpcMessagePort/HandleIncomingIpcMessagePort.js'
import * as HandleIncomingIpcWebSocket from '../HandleIncomingIpcWebSocket/HandleIncomingIpcWebSocket.js'
import * as HandleIpcModule from '../HandleIpcModule/HandleIpcModule.js'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.js'
import * as IsSocket from '../IsSocket/IsSocket.js'

const getIpcAndResponse = (module, handle, message) => {
  if (IsMessagePortMain.isMessagePortMain(handle)) {
    return HandleIncomingIpcMessagePort.handleIncomingIpcMessagePort(module, handle, message)
  }
  if (IsSocket.isSocket(handle)) {
    return HandleIncomingIpcWebSocket.handleIncomingIpcWebSocket(module, handle, message)
  }
  throw new Error(`Unexpected ipc handle`)
}

export const handleIncomingIpc = async (ipcId, handle, message) => {
  Assert.number(ipcId)
  const module = HandleIpcModule.getModule(ipcId)
  const { target, response } = await getIpcAndResponse(module, handle, message)
  await ApplyIncomingIpcResponse.applyIncomingIpcResponse(target, response, ipcId)
}
