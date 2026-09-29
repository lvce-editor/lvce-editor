import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchClipBoardProcess from '../LaunchClipBoardProcess/LaunchClipBoardProcess.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    state.ipc = LaunchClipBoardProcess.launchClipBoardProcess()
  }
  return state.ipc
}

export const invoke = async (method: any, ...params: any): Promise<any> => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
