import * as Assert from '../Assert/Assert.ts'
import * as Callback from '../Callback/Callback.ts'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const create = ({ ipc, execute }) => {
  Assert.object(ipc)
  Assert.fn(execute)
  const handleMessage = async (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, execute, Callback.resolve)
  }
  ipc.onmessage = handleMessage
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
}
