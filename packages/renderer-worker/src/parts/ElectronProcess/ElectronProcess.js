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
    Callback.resolve(message.id, message)
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
  const response = await JsonRpc.invoke(ipc, method, ...params)
  if ('result' in response) {
    return response.result
  }
  if ('error' in response) {
    console.log(response)
    throw new Error(response.error.message)
  }
  throw new Error('unexpected response')
}
