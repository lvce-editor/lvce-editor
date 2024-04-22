import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
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
  switch (ipcId) {
    case IpcId.TerminalProcess:
    case IpcId.ProcessExplorer:
    case IpcId.EmbedsProcess:
      return true
    default:
      return false
  }
}

// TODO fork ipc object instead of ref counting
// duplicated ipc object sends and receives one message
// original ipc object is never used and can
// be collected after being out of scope
// duplicated ipc can also be collected
// when it is out of scope

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
