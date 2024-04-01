import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'

export const create = (method, params) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  }
}
