const GetResponse = require('../GetResponse/GetResponse.js')

exports.handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  if ('result' in message || 'error' in message) {
    resolve(message.id, message)
    return
  }
  const response = await GetResponse.getResponse(message, execute, ipc)
  ipc.send(response)
}
