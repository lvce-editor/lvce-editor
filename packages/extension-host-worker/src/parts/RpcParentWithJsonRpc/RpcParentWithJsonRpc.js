import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as HandleJsonRpcMessage from '../HandleJsonRpcMessage/HandleJsonRpcMessage.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

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
