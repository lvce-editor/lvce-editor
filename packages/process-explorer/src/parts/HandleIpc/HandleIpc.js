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

const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
}

export const handleIpc = (ipc) => {
  ipc.on('message', handleMessage)
  if (ipc.start) {
    ipc.start()
  }
}
