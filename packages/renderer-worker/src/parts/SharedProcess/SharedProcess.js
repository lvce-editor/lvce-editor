/* istanbul ignore file */
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const listen = async () => {
  const ipc = await SharedProcessIpc.listen(IpcParentType.Node)
  HandleIpc.handleIpc(ipc)
  SharedProcessState.state.ipc = ipc
}

export const invoke = async (method, ...params) => {
  const { ipc } = SharedProcessState.state
  const result = await JsonRpc.invoke(ipc, method, ...params)
  return result
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const { ipc } = SharedProcessState.state
  const result = await JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
  return result
}

export const dispose = () => {
  SharedProcessState.state.ipc.dispose()
}

// TODO when shared process crashes / connection is lost: reconnect or show notification
