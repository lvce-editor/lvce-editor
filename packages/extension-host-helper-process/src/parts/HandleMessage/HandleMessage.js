import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const preparePrettyError = (error) => {
  return error
}

const logError = (error, prettyError) => {
  // this is handled by shared process
}

const requiresSocket = () => {
  return false
}

export const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
}
