import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

export const getResponse = async (message, ipc, execute, preparePrettyError, logError) => {
  try {
    const result = RequiresSocket.requiresSocket(message.method)
      ? await execute(message.method, ipc, ...message.params)
      : await execute(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error, ipc, preparePrettyError, logError)
  }
}
