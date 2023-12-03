import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as ShouldLogError from '../ShouldLogError/ShouldLogError.js'

const preparePrettyError = PrettyError.prepare

const logError = (error, prettyError) => {
  if (ShouldLogError.shouldLogError(error)) {
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
  }
}

export const handleIpc = (ipc) => {
  const handleMessage = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, preparePrettyError, logError)
  }
  ipc.on('message', handleMessage)
}
