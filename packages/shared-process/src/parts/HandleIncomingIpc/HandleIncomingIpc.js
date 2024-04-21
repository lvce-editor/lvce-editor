import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as HandleIpcModule from '../HandleIpcModule/HandleIpcModule.js'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.js'
import * as SendIncomingIpc from '../SendIncomingIpc/SendIncomingIpc.js'

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
      return SendIncomingIpc.sendIncomingIpc(target, response, ipcId)
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
