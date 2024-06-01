/* istanbul ignore file */
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

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
