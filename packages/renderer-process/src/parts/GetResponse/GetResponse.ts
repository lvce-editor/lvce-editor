import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.ts'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.ts'

export const getResponse = async (message, execute) => {
  try {
    const result = await execute(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
