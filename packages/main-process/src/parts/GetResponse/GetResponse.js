const GetErrorResponse = require('../GetErrorResponse/GetErrorResponse.js')
const GetSuccessResponse = require('../GetSuccessResponse/GetSuccessResponse.js')

exports.getResponse = async (message, execute) => {
  try {
    const result = await execute(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
