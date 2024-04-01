import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.ts'

export const handleIpc = (ipc) => {
  Assert.object(ipc)
  const handleMessage = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve)
  }
  ipc.onmessage = handleMessage
}
