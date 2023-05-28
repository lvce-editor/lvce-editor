import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Callback from '../Callback/Callback.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'

export const handleIpc = (ipc) => {
  Assert.object(ipc)
  const handleMessage = async (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve)
  }
  ipc.on('message', handleMessage)
}
