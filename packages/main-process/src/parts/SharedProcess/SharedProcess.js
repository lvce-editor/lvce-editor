import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchSharedProcess from '../LaunchSharedProcess/LaunchSharedProcess.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const getOrCreate = async ({ method, env = {} }) => {
  if (!SharedProcessState.state.promise) {
    SharedProcessState.state.promise = LaunchSharedProcess.launchSharedProcess({ method, env })
  }
  return SharedProcessState.state.promise
}

export const send = async (method, ...params) => {
  const ipc = await getOrCreate({
    method: IpcChildType.ElectronUtilityProcess,
  })
  JsonRpc.send(ipc, method, ...params)
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate({
    method: IpcChildType.ElectronUtilityProcess,
  })
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await getOrCreate({
    method: IpcChildType.ElectronUtilityProcess,
  })
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}
