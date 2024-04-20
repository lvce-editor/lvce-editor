import * as LaunchEmbedsProcess from '../LaunchEmbedsProcess/LaunchEmbedsProcess.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

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
  console.log('before ipc')
  const ipc = await getOrCreate()
  console.log('after ipc')
  return JsonRpc.invoke(ipc, method, ...params)
}
