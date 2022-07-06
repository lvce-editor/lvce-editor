/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as RendererProcessWithMessagePort from './RendererProcessWithMessagePort.js'
import * as RendererProcessWithModuleWorker from './RendererProcessWithModuleWorker.js'
import * as RendererProcessWithReferencePort from './RendererProcessWithReferencePort.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererProcess = async (event) => {
  const message = event.data
  if (message.id) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else {
      Callback.reject(message.id, message.error)
    }
  } else {
    console.log({ message })
    await Command.execute(message.method, ...message.params)
  }
}

const getIpc = () => {
  // TODO tree-shake out if/else in prod
  if (globalThis.acceptPort) {
    return RendererProcessWithMessagePort.listen()
  } else if (globalThis.acceptReferencePort) {
    return RendererProcessWithReferencePort.listen()
  } else {
    return RendererProcessWithModuleWorker.listen()
  }
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

export const invoke = async (method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    state.ipc.send({
      jsonrpc: '2.0',
      method,
      params,
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
