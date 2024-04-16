import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'
import * as ShouldLogError from '../ShouldLogError/ShouldLogError.js'

const preparePrettyError = PrettyError.prepare

const logError = (error, prettyError) => {
  if (ShouldLogError.shouldLogError(error)) {
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
  }
}

const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    preparePrettyError,
    logError,
    RequiresSocket.requiresSocket,
  )
}

export const handleIpc = (ipc) => {
  ipc.on('message', handleMessage)
  if (ipc.start) {
    ipc.start()
  }
}
