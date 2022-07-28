/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as IpcChild from '../IpcChild/IpcChild.js'

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
  return IpcChild.listen({ method: IpcChild.Methods.Auto })
}

export const listen = async () => {
  console.assert(state.pendingMessages.length === 0)
  const ipc = await getIpc()
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
    if (!state.ipc) {
      reject(new Error('ipc not active'))
      return
    }
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
