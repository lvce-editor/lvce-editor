import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'

export const handleIpc = (ipc) => {
  const handleMessageFromRendererWorker = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve)
  }
  ipc.onmessage = handleMessageFromRendererWorker
}
