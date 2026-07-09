import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchTypeScriptCompileProcess from '../LaunchTypeScriptCompileProcess/LaunchTypeScriptCompileProcess.ts'

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
