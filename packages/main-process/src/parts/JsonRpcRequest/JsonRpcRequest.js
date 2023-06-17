const Callback = require('../Callback/Callback.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

exports.create = (method, params) => {
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
