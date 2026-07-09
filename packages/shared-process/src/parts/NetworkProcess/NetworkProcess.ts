import * as LaunchNetworkProcess from '../LaunchNetworkProcess/LaunchNetworkProcess.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    state.ipc = LaunchNetworkProcess.launchNetworkProcess()
  }
  return state.ipc
}

export const invoke = async (method: any, ...params: any): Promise<any> => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
