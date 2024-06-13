import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'

export const create = (method: string, params: any) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: params,
  }
}
