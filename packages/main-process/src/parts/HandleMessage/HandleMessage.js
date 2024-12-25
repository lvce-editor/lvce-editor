import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

const logError = (error, prettyError) => {
  // ignore. error is logged by shared process
}

export const handleMessage = (event) => {
  return JsonRpc.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    PrettyError.prepare,
    logError,
    RequiresSocket.requiresSocket,
  )
}
