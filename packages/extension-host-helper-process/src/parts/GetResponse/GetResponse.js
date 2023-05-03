import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'

export const getResponse = async (message, execute) => {
  try {
    const result = await execute(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    console.log({ error })
    console.log('got err')
    const GetErrorResponse = await import('../GetErrorResponse/GetErrorResponse.js')
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
