import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const prepareError = (error) => {
  return error
}

const logError = (error) => {
  console.error(error)
}

const requiresSocket = () => {
  return false
}

export const handleIpc = (ipc) => {
  const handleMessage = (message) => {
    JsonRpc.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, prepareError, logError, requiresSocket)
  }
  ipc.onmessage = handleMessage
}
