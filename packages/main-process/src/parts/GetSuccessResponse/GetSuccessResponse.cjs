const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.cjs')

exports.getSuccessResponse = (message, result) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    result,
  }
}
