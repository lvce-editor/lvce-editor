const Command = require('../Command/Command.js')
const GetResponse = require('../GetResponse/GetResponse.js')

exports.handleIpc = (ipc) => {
  const handleMessage = async (message) => {
    const response = await GetResponse.getResponse(message, Command.execute)
    ipc.send(response)
  }
  ipc.on('message', handleMessage)
}
