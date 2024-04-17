import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'

const handleMessage = (event) => {
  return HandleJsonRpcMessage.handleJsonRpcMessage(event.target, event.data, Command.execute, Callback.resolve, 'process')
}

export const handleIpc = (ipc) => {
  ipc.onmessage = handleMessage
}
