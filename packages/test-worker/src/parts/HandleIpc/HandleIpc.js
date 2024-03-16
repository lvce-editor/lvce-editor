import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'

export const handleIpc = (ipc, source = 'process') => {
  const handleMessage = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, source)
  }
  ipc.onmessage = handleMessage
}
