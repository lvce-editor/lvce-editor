const Command = require('../Command/Command.js')
const Callback = require('../Callback/Callback.js')
const HandleJsonRpcMessage = require('../HandleJsonRpcMessage/HandleJsonRpcMessage.js')

exports.handleIpc = (ipc) => {
  const handleMessage = (message) => {
    return HandleJsonRpcMessage.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve)
  }
  ipc.on('message', handleMessage)
}
