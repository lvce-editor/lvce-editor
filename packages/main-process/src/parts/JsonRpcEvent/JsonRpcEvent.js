import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.cjs'

export const create = (method, params) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  }
}
