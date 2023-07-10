const Assert = require('../Assert/Assert.js')
const IsMessagePortMain = require('../IsMessagePortMain/IsMessagePortMain.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')

exports.getWindowId = (ipc) => {
  Assert.object(ipc)
  const messagePort = ipc.messagePort
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new Error(`messagePort must be of type MessagePortMain`)
  }
  const config = AppWindowStates.findByPort(messagePort)
  if (!config) {
    throw new Error(`no matching window found`)
  }
  const windowId = config.windowId
  Assert.number(windowId)
  return windowId
}
