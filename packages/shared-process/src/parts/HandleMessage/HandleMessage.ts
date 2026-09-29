import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as PrettyError from '../PrettyError/PrettyError.ts'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.ts'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.ts'
import * as ShouldLogError from '../ShouldLogError/ShouldLogError.ts'

const preparePrettyError = PrettyError.prepare

const logError = (error: any, prettyError?: any): any => {
  if (ShouldLogError.shouldLogError(error)) {
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
  }
}

export const handleMessage = (event: any): any => {
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
