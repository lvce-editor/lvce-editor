import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.ts'

const handleMessage = (event) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve)
}

export const handleIpc = (ipc) => {
  Assert.object(ipc)
  ipc.onmessage = handleMessage
}
