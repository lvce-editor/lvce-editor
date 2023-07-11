import * as JsonRpcSuccessResponse from '../JsonRpcSuccessResponse/JsonSuccessResponse.js'

export const getSuccessResponse = (message, result) => {
  const resultProperty = result ?? null
  return JsonRpcSuccessResponse.create(message, resultProperty)
}
