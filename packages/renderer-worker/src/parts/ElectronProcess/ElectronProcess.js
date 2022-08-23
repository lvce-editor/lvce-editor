import * as IpcParent from '../IpcParent/IpcParent.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Callback from '../Callback/Callback.js'

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

const handleMessage = (message) => {
  if ('id' in message) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(message.id, message.error)
    }
  }
}

// TODO race condition
const getIpc = async () => {
  if (!state.ipc) {
    const ipc = await createIpc()
    ipc.onmessage = handleMessage
    state.ipc = ipc
  }
  return state.ipc
}

export const invoke = async (method, ...params) => {
  const ipc = await getIpc()
  return JsonRpc.invoke(ipc, method, ...params)
}
