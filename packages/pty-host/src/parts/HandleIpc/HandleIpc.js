import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

const preparePrettyError = PrettyError.prepare

const logError = (error, prettyError) => {
  PrintPrettyError.printPrettyError(prettyError, `[terminal-process] `)
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
  Assert.object(ipc)
  ipc.on('message', handleMessage)
}
