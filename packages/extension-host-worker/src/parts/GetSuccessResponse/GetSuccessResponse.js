import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const getSuccessResponse = (message, result) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    result,
  }
}
