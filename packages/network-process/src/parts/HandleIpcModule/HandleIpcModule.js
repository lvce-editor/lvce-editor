import * as Assert from '../Assert/Assert.js'
import * as HandleIpcSharedProcess from '../HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as IpcId from '../IpcId/IpcId.js'

export const getModule = (ipcId) => {
  Assert.number(ipcId)
  switch (ipcId) {
    case IpcId.SharedProcess:
      return HandleIpcSharedProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
