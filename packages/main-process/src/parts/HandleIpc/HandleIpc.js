const Command = require('../Command/Command.js')
const Callback = require('../Callback/Callback.js')
const GetResponse = require('../GetResponse/GetResponse.js')

exports.handleIpc = (ipc) => {
  const handleMessage = async (message) => {
    if ('result' in message || 'error' in message) {
      Callback.resolve(message.id, message)
      return
    }
    const response = await GetResponse.getResponse(message, Command.execute)
    ipc.send(response)
  }
  ipc.on('message', handleMessage)
}
