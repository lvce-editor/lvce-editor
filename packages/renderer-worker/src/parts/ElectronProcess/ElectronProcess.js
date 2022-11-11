import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const createIpc = async () => {
  return IpcParent.create({
    method: IpcParentType.Electron,
    type: 'electron-process',
  })
}

const handleMessage = async (message) => {
  if ('id' in message) {
    Callback.resolve(message.id, message)
  } else if ('method' in message) {
    await Command.execute(message.method, ...message.params)
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
  if (error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
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
