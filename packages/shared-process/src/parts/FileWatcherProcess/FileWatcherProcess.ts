import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchFileWatcherProcess from '../LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchFileWatcherProcess.launchFileWatcherProcess()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
