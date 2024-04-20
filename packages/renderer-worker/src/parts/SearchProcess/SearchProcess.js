import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchSearchProcess from '../LaunchSearchProcess/LaunchSearchProcess.js'

const state = {
  /**
   * @type {Promise<any>|undefined}
   */
  ipc: undefined,
}

export const getOrCreate = () => {
  if (!state.ipc) {
    // @ts-ignore
    state.ipc = LaunchSearchProcess.launchSearchProcess()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
