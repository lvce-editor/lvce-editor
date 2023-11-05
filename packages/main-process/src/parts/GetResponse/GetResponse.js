import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

export const getResponse = async (message, execute, handle) => {
  try {
    const result = await (RequiresSocket.requiresSocket(message.method)
      ? execute(message.method, ...message.params, handle)
      : execute(message.method, ...message.params))
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
