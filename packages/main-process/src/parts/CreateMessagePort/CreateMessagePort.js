import * as Assert from '../Assert/Assert.js'
import * as HandleMessagePortForSharedProcess from '../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js'

// TODO reverse order of parameters: make ports first
// TODO when sending transferrables, remove them from parameters
export const createMessagePort = async (ipcId, port, webContentsId) => {
  Assert.number(ipcId)
  Assert.object(port)
  await HandleMessagePortForSharedProcess.handlePort(port, ipcId)
  return webContentsId
}
