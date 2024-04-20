import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchEmbedsProcess from '../LaunchEmbedsProcess/LaunchEmbedsProcess.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchEmbedsProcess.launchEmbedsProcess()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (method, transfer, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}
