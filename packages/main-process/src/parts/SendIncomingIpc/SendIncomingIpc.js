import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const state = {
  pendingCount: Object.create(null),
}

const addState = (ipcId) => {
  state.pendingCount[ipcId] ||= 0
  state.pendingCount[ipcId]++
}

const removeState = (ipcId) => {
  state.pendingCount[ipcId]--
  if (state.pendingCount[ipcId] === 0) {
    delete state.pendingCount[ipcId]
  }
}

const hasState = (ipcId) => {
  return ipcId in state.pendingCount
}

const supportsPartialIpcHandling = (ipcId) => {
  return false
}

export const sendIncomingIpc = async (target, response, ipcId) => {
  if (!hasState(ipcId) && supportsPartialIpcHandling(ipcId)) {
    HandleIpc.handleIpc(target)
  }
  addState(ipcId)
  await JsonRpc.invokeAndTransfer(target, response.transfer, response.method, ...response.params)
  removeState(ipcId)
  if (!hasState(ipcId) && supportsPartialIpcHandling(ipcId)) {
    HandleIpc.unhandleIpc(target)
  }
}
