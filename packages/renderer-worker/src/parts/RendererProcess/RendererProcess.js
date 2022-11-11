/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

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
    if ('method' in message) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        state.ipc.send({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result,
        })
        return
      } catch (error) {
        state.ipc.send({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          error,
        })
        return
      }
    }
    Callback.resolve(message.id, message)
    return
  }
  await Command.execute(message.method, ...message.params)
}

const getIpc = () => {
  return IpcChild.listen({ method: IpcChildType.Auto() })
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

const deserializeError = (serializedError) => {
  const error = new Error()
  if (serializedError && serializedError.message) {
    error.message = serializedError.message
  }
  if (serializedError && serializedError.stack) {
    error.stack = serializedError.stack
  }
  return error
}

const combineStacks = (upperStack, lowerStack) => {
  const indexNewLine = lowerStack.indexOf('\n')
  return upperStack + lowerStack.slice(indexNewLine)
}

class RendererProcessError extends Error {
  constructor(serializedError) {
    const deserializedError = deserializeError(serializedError)
    super(deserializedError.message)
    if (this.stack) {
      this.stack = combineStacks(deserializedError.stack, this.stack)
    }
  }
}

export const invoke = async (method, ...parameters) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    if (!state.ipc) {
      reject(new Error('ipc not active'))
      return
    }
    state.ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params: parameters,
      id: callbackId,
    })
  })
  if ('error' in responseMessage) {
    throw new RendererProcessError(responseMessage.error)
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  new JsonRpcError('unexpected message from renderer process')
}

export const sendAndTransfer = (message, transferables) => {
  state.ipc.sendAndTransfer(message, transferables)
}
