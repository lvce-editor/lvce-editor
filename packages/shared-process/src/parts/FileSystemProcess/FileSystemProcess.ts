import * as LaunchFileSystemProcess from '../LaunchFileSystemProcess/LaunchFileSystemProcess.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

// TODO use createLazyRpc
export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchFileSystemProcess.launchFileSystemProcess()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
