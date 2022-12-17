import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/JsonRpcError.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererWorker = async (event) => {
  const message = event.data
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      state.ipc.send(response)
      return
    }
    Callback.resolve(message.id, message)
    return
  }
  if (message.method === 'get-port') {
    const port = await getPort(...message.params)
    state.ipc.sendAndTransfer(
      {
        jsonrpc: '2.0',
        id: message._id,
        result: port,
      },
      [port]
    )
    return
  }
  throw new JsonRpcError('unexpected message from renderer worker')
}

const getIpc = async () => {
  const isElectron = Platform.isElectron()
  const name = isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  const rendererWorker = await IpcParent.create({
    method: IpcParentType.Auto,
    url: Platform.getRendererWorkerUrl(),
    name,
  })
  return {
    send(message) {
      rendererWorker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      rendererWorker.postMessage(message, transferables)
    },
    get onmessage() {
      return rendererWorker.onmessage
    },
    set onmessage(listener) {
      rendererWorker.onmessage = listener
    },
  }
}

const getPort = (options) => {
  return IpcParent.create(options)
}

export const hydrate = async (config) => {
  const ipc = await getIpc()
  ipc.onmessage = handleMessageFromRendererWorker
  state.ipc = ipc
}

// TODO needed?
export const dispose = () => {
  if (state.rendererWorker) {
    state.rendererWorker.terminate()
  }
}

export const send = (method, ...params) => {
  state.ipc.send({
    jsonrpc: '2.0',
    method,
    params,
  })
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

class RendererWorkerError extends Error {
  constructor(serializedError) {
    const deserializedError = deserializeError(serializedError)
    super(deserializedError.message)
    if (this.stack) {
      this.stack = combineStacks(deserializedError.stack, this.stack)
    }
  }
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
  if ('error' in responseMessage) {
    throw new RendererWorkerError(responseMessage.error)
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }

  throw new JsonRpcError('unexpected message from renderer worker')
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
