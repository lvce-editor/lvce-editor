import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

exports.getSuccessResponse = (message, result) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    result,
  }
}
