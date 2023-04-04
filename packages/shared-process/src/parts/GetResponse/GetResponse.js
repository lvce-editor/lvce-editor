import * as Command from '../Command/Command.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

export const getResponse = async (message, handle) => {
  try {
    const result = RequiresSocket.requiresSocket(message.method)
      ? await Command.execute(message.method, handle, ...message.params)
      : await Command.execute(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
