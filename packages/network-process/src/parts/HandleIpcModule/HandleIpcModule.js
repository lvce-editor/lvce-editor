import * as Assert from '../Assert/Assert.js'
import * as HandleIpcSharedProcess from '../HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as IpcId from '../IpcId/IpcId.js'

export const getModule = (ipcId) => {
  Assert.number(ipcId)
  switch (ipcId) {
    case IpcId.SharedProcess:
      return HandleIpcSharedProcess
    case IpcId.EmbedsProcess:
      return HandleIpcEmbedsProcess
    case IpcId.TerminalProcess:
      return HandleIpcTerminalProcess
    case IpcId.ExtensionHostHelperProcess:
      return HandleIpcExtensionHostHelperProcess
    case IpcId.ProcessExplorer:
      return HandleIpcProcessExplorer
    case IpcId.SearchProcess:
      return HandleIpcSearchProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
