import * as Assert from '../Assert/Assert.js'
import * as HandleIpcSharedProcess from '../HandleIpcMainProcess/HandleIpcMainProcess.js'
import * as HandleIpcUtilityProcess from '../HandleIpcUtilityProcess/HandleIpcUtilityProcess.js'
import * as IpcId from '../IpcId/IpcId.js'

export const getModule = (ipcId) => {
  Assert.number(ipcId)
  switch (ipcId) {
    case IpcId.SharedProcess:
      return HandleIpcSharedProcess
    case IpcId.UtilityProcess:
      return HandleIpcUtilityProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
