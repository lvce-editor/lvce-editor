const Command = require('../Command/Command.js')
const GetSuccessResponse = require('../GetSuccessResponse/GetSuccessResponse.js')
const GetErrorResponse = require('../GetErrorResponse/GetErrorResponse.js')

exports.getResponse = async (message) => {
  try {
    const result = await Command.invoke(message.method, ...message.params)
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
