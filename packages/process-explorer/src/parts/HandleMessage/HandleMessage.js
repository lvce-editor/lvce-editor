import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const preparePrettyError = (error) => {
  return error
}

const logError = (error) => {
  console.error(error)
}

const requiresSocket = () => {
  return false
}

export const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
}
