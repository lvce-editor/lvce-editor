import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchEmbedsWorker from '../LaunchEmbedsWorker/LaunchEmbedsWorker.js'

const state = {
  /**
   * @type {any}
   */
  workerPromise: undefined,
}

export const getOrCreate = () => {
  state.workerPromise ||= LaunchEmbedsWorker.launchEmbedsWorker()
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
