import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../JsonRpc/JsonRpc.ts'

const requiresSocket = () => {
  return false
}

const preparePrettyError = (error) => {
  return error
}

const logError = (error) => {
  console.error(error)
}

const handleMessage = (event) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    preparePrettyError,
    logError,
    requiresSocket,
  )
}

export const handleIpc = (ipc) => {
  ipc.onmessage = handleMessage
}
