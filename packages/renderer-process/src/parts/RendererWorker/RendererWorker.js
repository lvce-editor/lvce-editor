import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/JsonRpcError.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

class NonError extends Error {
  name = 'NonError'

  constructor(message) {
    super(message)
  }
}

// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.js (License MIT)
const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}

const serializeError = (error) => {
  error = ensureError(error)
  return {
    stack: error.stack,
    message: error.message,
  }
}

const handleMessageFromRendererWorker = async (event) => {
  const message = event.data
  if ('id' in message) {
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
        const serializedError = serializeError(error)
        state.ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: serializedError.message,
            stack: serializedError.stack,
          },
        })
      }
      return
    }
    Callback.resolve(message.id, message)
    return
  }
  if (message.method === 'get-port') {
    const type = message.params[0]
    const port = await getPort(type)
    state.ipc.sendAndTransfer('port', [port])
    return
  }
  throw new JsonRpcError('unexpected message from renderer worker')
}

const getIpc = async () => {
  const rendererWorker = await IpcParent.create({
    method: IpcParentType.Auto,
    url: Platform.getRendererWorkerUrl(),
    name: 'Renderer Worker',
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

const getPort = (type) => {
  return new Promise((resolve, reject) => {
    const handleMessageFromWindow = (event) => {
      const port = event.ports[0]
      resolve(port)
    }

    // @ts-ignore
    window.addEventListener('message', handleMessageFromWindow, {
      once: true,
    })
    // @ts-ignore
    window.myApi.ipcConnect(type)
  })
}

export const hydrate = async (config) => {
  const ipc = await getIpc()

  // setup electron message port
  if (Platform.isElectron()) {
    const event = await new Promise((resolve, reject) => {
      const handleIpcMessage = async (event) => {
        resolve(event)
      }
      ipc.onmessage = handleIpcMessage
    })
    if (event.data.method !== 'get-port') {
      throw new Error('unexpected message from renderer worker')
    }
    const type = event.data.params[0]
    const port = await getPort(type)
    ipc.sendAndTransfer('port', [port])
  }
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
