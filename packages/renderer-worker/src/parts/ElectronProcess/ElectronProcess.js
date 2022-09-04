import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
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

const restoreError = (error) => {
  if (error instanceof Error) {
    return error
  }
  if (error.code && error.code === -32601) {
    console.log('create json rpc error')
    const restoredError = new JsonRpcError(error.message)
    restoredError.stack = error.stack
    return restoredError
  }
  const restoredError = new Error(error.message)
  if (error.data) {
    if (error.data.stack) {
      restoredError.stack = error.data.stack
    }
    if (error.data.codeFrame) {
      // @ts-ignore
      restoredError.codeFrame = error.data.codeFrame
    }
  }
  return restoredError
}

export const invoke = async (method, ...params) => {
  const ipc = await getIpc()
  const response = await JsonRpc.invoke(ipc, method, ...params)
  if ('result' in response) {
    return response.result
  }
  if ('error' in response) {
    const restoredError = restoreError(response.error)
    throw restoredError
  }
  throw new Error('unexpected response')
}
