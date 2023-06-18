const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

exports.create = (method, params) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  }
}
