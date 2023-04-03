const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const GetResponse = require('../GetResponse/GetResponse.js')

/**
 *
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = (event) => {
  const browserWindowPort = event.ports[0]
  const { id } = event.sender
  const state = AppWindowStates.findById(id)
  state.port = browserWindowPort
  const handleMessage = async (event) => {
    const message = event.data
    const response = await GetResponse.getResponse(message)
    browserWindowPort.postMessage(response)
  }
  browserWindowPort.on('message', handleMessage)
  browserWindowPort.start()
}
