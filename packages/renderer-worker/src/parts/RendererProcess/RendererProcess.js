/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as IpcWithMessagePort from '../Ipc/IpcWithMessagePort.js'
import * as IpcWithModuleWorker from '../Ipc/IpcWithModuleWorker.js'
import * as IpcWithReferencePort from '../Ipc/IpcWithReferencePort.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererProcess = async (event) => {
  const message = event.data
  if (typeof message === 'string') {
    console.warn(`unexpected message from renderer process: ${message}`)
    return
  }
  if (message.id) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
      return
    }
    if ('error' in message) {
      Callback.reject(message.id, message.error)
      return
    }
    if ('method' in message) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        state.ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          result,
        })
        return
      } catch (error) {
        state.ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          error,
        })
        return
      }
    }

    Callback.reject(
      message.id,
      new JsonRpcError('unexpected message from renderer process')
    )
    return
  }
  await Command.execute(message.method, ...message.params)
}

const getIpc = () => {
  // TODO tree-shake out if/else in prod
  if (globalThis.acceptPort) {
    return IpcWithMessagePort.listen()
  }
  if (globalThis.acceptReferencePort) {
    return IpcWithReferencePort.listen()
  }
  return IpcWithModuleWorker.listen()
}

export const listen = () => {
  console.assert(state.pendingMessages.length === 0)
  const ipc = getIpc()
  ipc.onmessage = handleMessageFromRendererProcess
  state.ipc = ipc
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.ipc.send(message)
}

export const invoke = async (method, ...parameters) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    state.ipc.send({
      jsonrpc: '2.0',
      method,
      params: parameters,
      id: callbackId,
    })
  })
  if (responseMessage instanceof Error) {
    throw responseMessage
  }
  return responseMessage
}

export const sendAndTransfer = (message, transferables) => {
  state.ipc.sendAndTransfer(message, transferables)
}
