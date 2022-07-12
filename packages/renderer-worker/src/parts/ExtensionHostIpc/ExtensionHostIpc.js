import * as ExtensionHostIpcWithSharedProcess from './ExtensionHostIpcWithSharedProcess.js'
import * as ExtensionHostIpcWithWebWorker from './ExtensionHostIpcWithWebWorker.js'
import * as Callback from '../Callback/Callback.js'

export const Methods = {
  SharedProcess: 1,
  WebWorker: 2,
}

const getIpc = (method) => {
  switch (method) {
    case Methods.SharedProcess:
      return ExtensionHostIpcWithSharedProcess.listen()
    case Methods.WebWorker:
      return ExtensionHostIpcWithWebWorker.listen()
    default:
      throw new Error(`unexpected extension host type: ${method}`)
  }
}

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const handleMessage = (event) => {
  const message = event.data
  if (message.id) {
    if (isResultMessage(message)) {
      Callback.resolve(message.id, message.result)
    } else if (isErrorMessage(message)) {
      Callback.reject(message.id, message.error)
    } else {
      throw new Error('unexpected message type')
    }
  } else {
    throw new Error('unexpected message type')
  }
}

export const listen = async (method) => {
  const ipc = await getIpc(method)
  ipc.onmessage = handleMessage
  return ipc
}
