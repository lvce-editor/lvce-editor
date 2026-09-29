import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchPreviewProcess from '../LaunchPreviewProcess/LaunchPreviewProcess.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    state.ipc = LaunchPreviewProcess.launchPreviewProcess()
  }
  return state.ipc
}

export const invoke = async (method: any, ...params: any): Promise<any> => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (method: any, ...params: any): Promise<any> => {
  const ipc = await getOrCreate()
  return JsonRpc.invokeAndTransfer(ipc, method, ...params)
}
