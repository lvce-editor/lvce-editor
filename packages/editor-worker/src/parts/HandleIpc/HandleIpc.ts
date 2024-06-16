import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.ts'

export const handleIpc = (ipc: any, source = 'process') => {
  const handleMessage = (message: any) => {
    // @ts-ignore
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, source)
  }
  ipc.onmessage = handleMessage
}
