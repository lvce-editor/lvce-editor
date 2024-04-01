import * as Callback from '../Callback/Callback.ts'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'

export const create = (method, params) => {
  const { id, promise } = Callback.registerPromise()
  const message = {
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  }
  return {
    message,
    promise,
  }
}
