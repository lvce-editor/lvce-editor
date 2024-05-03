import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchTypeScriptCompileProcess from '../LaunchTypeScriptCompileProcess/LaunchTypeScriptCompileProcess.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchTypeScriptCompileProcess.launchTypeScriptCompileProcess()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
