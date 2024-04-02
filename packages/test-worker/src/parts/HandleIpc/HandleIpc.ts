import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../JsonRpc/JsonRpc.ts'

const handleMessage = (event) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(event, Command.execute, Callback.resolve)
}

export const handleIpc = (ipc) => {
  ipc.onmessage = handleMessage
}
