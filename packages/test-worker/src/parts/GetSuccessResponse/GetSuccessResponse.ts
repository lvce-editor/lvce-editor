import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'

export const getSuccessResponse = (message, result) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    result: result ?? null,
  }
}
