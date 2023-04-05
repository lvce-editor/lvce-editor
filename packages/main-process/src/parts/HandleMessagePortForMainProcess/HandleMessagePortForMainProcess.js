const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Assert = require('../Assert/Assert.js')
const GetResponse = require('../GetResponse/GetResponse.js')
const Command = require('../Command/Command.js')

/**
 *
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = (event, browserWindowPort) => {
  Assert.object(event)
  Assert.object(browserWindowPort)
  const { id } = event.sender
  const state = AppWindowStates.findById(id)
  if (state) {
    state.port = browserWindowPort
  }
  const handleMessage = async (event) => {
    const message = event.data
    const response = await GetResponse.getResponse(message, Command.execute)
    browserWindowPort.postMessage(response)
  }
  browserWindowPort.on('message', handleMessage)
  browserWindowPort.start()
}
