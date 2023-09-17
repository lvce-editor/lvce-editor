import * as Assert from '../Assert/Assert.cjs'
import * as IsMessagePortMain from '../IsMessagePortMain/IsMessagePortMain.js'
import * as AppWindowStates from '../AppWindowStates/AppWindowStates.cjs'

export const getWindowId = (ipc) => {
  Assert.object(ipc)
  const {messagePort} = ipc
  if (!IsMessagePortMain.isMessagePortMain(messagePort)) {
    throw new Error(`messagePort must be of type MessagePortMain`)
  }
  const config = AppWindowStates.findByPort(messagePort)
  if (!config) {
    throw new Error(`no matching window found`)
  }
  const {windowId} = config
  Assert.number(windowId)
  return windowId
}
