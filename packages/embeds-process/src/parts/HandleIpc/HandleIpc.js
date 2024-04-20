import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const prepare = (error) => {
  return error
}

const requiresSocket = () => {
  return false
}

const logError = (error, prettyError) => {
  console.error(error)
}

const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve, prepare, logError, requiresSocket)
}

export const handleIpc = (ipc) => {
  ipc.on('message', handleMessage)
}
