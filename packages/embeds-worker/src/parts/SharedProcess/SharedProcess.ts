import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchSharedProcessIpc from '../LaunchSharedProcessIpc/LaunchSharedProcessIpc.ts'

interface State {
  workerPromise?: Promise<any>
}

const state: State = {
  workerPromise: undefined,
}

export const getOrCreate = () => {
  state.workerPromise ||= LaunchSharedProcessIpc.launchSharedProcessIpc()
  return state.workerPromise
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await getOrCreate()
  await JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  await JsonRpc.invoke(ipc, method, ...params)
}
