import * as IpcParent from '../IpcParent/IpcParent.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const createIpc = async () => {
  return IpcParent.create({
    method: IpcParent.Methods.Electron,
    type: 'electron-process',
  })
}

const getIpc = async () => {
  if (!state.ipc) {
    state.ipc = await createIpc()
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getIpc()
  return JsonRpc.invoke(ipc, method, ...params)
}
