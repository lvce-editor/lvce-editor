import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchEmbedsProcessIpc from '../LaunchEmbedsProcessIpc/LaunchEmbedsProcessIpc.ts'

interface State {
  workerPromise?: Promise<any>
}

const state: State = {
  workerPromise: undefined,
}

export const getOrCreate = () => {
  state.workerPromise ||= LaunchEmbedsProcessIpc.launchEmbedsProcessIpc()
  return state.workerPromise
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
