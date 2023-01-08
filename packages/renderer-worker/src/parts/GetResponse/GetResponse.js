import * as Command from '../Command/Command.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const getErrorResponse = (message, error) => {
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error,
  }
}

export const getResponse = async (message) => {
  try {
    const result = await Command.execute(message.method, ...message.params)
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      result,
    }
  } catch (error) {
    return getErrorResponse(message, error)
  }
}
