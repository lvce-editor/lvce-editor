import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as HandleIpcModule from '../HandleIpcModule/HandleIpcModule.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const handleIncomingIpcMessagePort = async (module, handle, message) => {
  const target = await module.targetMessagePort(handle, message)
  const response = module.upgradeMessagePort(handle, message)
  return {
    target,
    response,
  }
}

const handleIncomingIpcWebSocket = async (module, handle, message) => {
  const target = await module.targetWebSocket(handle, message)
  const response = module.upgradeWebSocket(handle, message)
  return {
    target,
    response,
  }
}

const getIpcAndResponse = (module, handle, message) => {
  if (IsMessagePortMain.isMessagePortMain(handle)) {
    return handleIncomingIpcMessagePort(module, handle, message)
  }
  return handleIncomingIpcWebSocket(module, handle, message)
}

const applyResponse = async (target, response, ipcId) => {
  switch (response.type) {
    case 'handle':
      HandleIpc.handleIpc(target)
      break
    case 'send':
      // TODO handle and unhandle ipc message by default
      if (ipcId === IpcId.TerminalProcess) {
        HandleIpc.handleIpc(target)
      }
      await JsonRpc.invokeAndTransfer(target, response.transfer, response.method, ...response.params)
      if (ipcId === IpcId.TerminalProcess) {
        HandleIpc.unhandleIpc(target)
      }
      break
    default:
      throw new Error('unexpected response')
  }
}

export const handleIncomingIpc = async (ipcId, handle, message) => {
  Assert.number(ipcId)
  const module = HandleIpcModule.getModule(ipcId)
  const { target, response } = await getIpcAndResponse(module, handle, message)
  await applyResponse(target, response, ipcId)
}
