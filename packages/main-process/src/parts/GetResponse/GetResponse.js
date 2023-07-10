const GetErrorResponse = require('../GetErrorResponse/GetErrorResponse.js')
const GetSuccessResponse = require('../GetSuccessResponse/GetSuccessResponse.js')
const RequiresSocket = require('../RequiresSocket/RequiresSocket.js')

exports.getResponse = async (message, execute, handle) => {
  try {
    const result = await (RequiresSocket.requiresSocket(message.method)
      ? execute(message.method, ...message.params, handle)
      : execute(message.method, ...message.params))
    return GetSuccessResponse.getSuccessResponse(message, result)
  } catch (error) {
    return GetErrorResponse.getErrorResponse(message, error)
  }
}
