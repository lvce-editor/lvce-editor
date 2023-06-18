import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const create = (message, error) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error,
  }
}
