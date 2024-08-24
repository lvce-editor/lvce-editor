import * as Assert from '../Assert/Assert.js'
import * as HandleMessagePortForSharedProcess from '../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js'

// TODO reverse order of parameters: make ports first
export const createMessagePort = async (ipcId, webContentsId, port) => {
  Assert.number(ipcId)
  Assert.object(port)
  await HandleMessagePortForSharedProcess.handlePort(port, ipcId)
  console.log({ ipcId, webContentsId, port })
  return webContentsId
}
