import * as Assert from '../Assert/Assert.js'
import * as HandleIpcEmbedsWorker from '../HandleIpcEmbedsWorker/HandleIpcEmbedsWorker.js'
import * as HandleIpcMainProcess from '../HandleIpcMainProcess/HandleIpcMainProcess.js'
import * as HandleIpcSharedProcess from '../HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as IpcId from '../IpcId/IpcId.js'

export const getModule = (ipcId) => {
  Assert.number(ipcId)
  switch (ipcId) {
    case IpcId.SharedProcess:
      return HandleIpcSharedProcess
    case IpcId.EmbedsWorker:
      return HandleIpcEmbedsWorker
    case IpcId.MainProcess:
      return HandleIpcMainProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
