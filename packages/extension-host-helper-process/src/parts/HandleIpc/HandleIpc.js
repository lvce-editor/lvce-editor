import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'

const preparePrettyError = PrettyError.prepare

const logError = (error, prettyError) => {
  PrintPrettyError.printPrettyError(prettyError, `[extension-host-helper-process] `)
}

const requiresSocket = () => {
  return false
}

export const handleIpc = (ipc) => {
  const handleMessage = (message) => {
    return JsonRpc.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
  }
  ipc.on('message', handleMessage)
}
