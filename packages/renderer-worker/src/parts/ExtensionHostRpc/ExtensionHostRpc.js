import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const restoreError = (error) => {
  if (error instanceof Error) {
    return error
  }
  if (error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
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

const handleMessageResult = (message) => {
  Callback.resolve(message.id, message.result)
}

const handleMessageError = (message) => {
  const restoredError = restoreError(message.error)
  Callback.reject(message.id, restoredError)
}

const handleMessageMethod = async (message, event) => {
  if (message.method === 'ElectronMessagePort.create') {
    const IpcParentWithElectron = await import(
      '../IpcParent/IpcParentWithElectron.js'
    )
    const ipc = await IpcParentWithElectron.create({
      type: 'extension-host-helper-process',
    })
    event.target.postMessage(
      {
        jsonrpc: '2.0',
        id: message.id,
        result: ipc._port,
      },
      [ipc._port]
    )
    console.log({ ipc, event, target: event.target })
  }
}

const handleMessage = (message, event) => {
  if (message.id) {
    if (isResultMessage(message)) {
      handleMessageResult(message)
    } else if (isErrorMessage(message)) {
      handleMessageError(message)
    } else if ('method' in message) {
      handleMessageMethod(message, event)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = (ipc) => {
  // TODO maybe pass handleMessage as paramter to make code more functional
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
