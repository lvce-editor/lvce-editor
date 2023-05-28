import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'

export const handleIpc = (ipc, execute) => {
  Assert.object(ipc)
  Assert.fn(execute)
  const handleMessage = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, execute, Callback.resolve)
  }
  ipc.onmessage = handleMessage
}
