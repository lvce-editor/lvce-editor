import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { JsonRpcEvent } from '../JsonRpc/JsonRpc.js'
import * as LaunchSharedProcess from '../LaunchSharedProcess/LaunchSharedProcess.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const hydrate = async ({ method, env = {} }) => {
  if (!SharedProcessState.state.promise) {
    SharedProcessState.state.promise = LaunchSharedProcess.launchSharedProcess({ method, env })
  }
  return SharedProcessState.state.promise
}

export const send = async (method, ...params) => {
  const message = JsonRpcEvent.create(method, params)
  const ipc = await SharedProcessState.state.promise
  ipc.send(message)
}

export const invoke = async (method, ...params) => {
  const ipc = await SharedProcessState.state.promise
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await SharedProcessState.state.promise
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}
