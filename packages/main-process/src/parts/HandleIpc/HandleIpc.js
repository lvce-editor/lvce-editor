import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

const logError = (error, prettyError) => {
  PrintPrettyError.printPrettyError(prettyError, '[main-process] ')
}

const getActualIpcAndMessage = (ipc, message) => {
  if (ipc.supportsTargetProperty) {
    return {
      actualIpc: message.target,
      actualMessage: message.data,
    }
  }
  return {
    actualIpc: ipc,
    actualMessage: message,
  }
}

export const handleIpc = (ipc) => {
  const handleMessage = (message) => {
    const { actualIpc, actualMessage } = getActualIpcAndMessage(ipc, message)
    return JsonRpc.handleJsonRpcMessage(
      actualIpc,
      actualMessage,
      Command.execute,
      Callback.resolve,
      PrettyError.prepare,
      logError,
      RequiresSocket.requiresSocket,
    )
  }
  ipc.on('message', handleMessage)
}
