import * as Assert from '../Assert/Assert.ts'
import * as HandleIpcAuthProcess from '../HandleIpcAuthProcess/HandleIpcAuthProcess.ts'
import * as HandleIpcClipBoardProcess from '../HandleIpcClipBoardProcess/HandleIpcClipBoardProcess.ts'
import * as HandleIpcEmbedsProcess from '../HandleIpcEmbedsProcess/HandleIpcEmbedsProcess.ts'
import * as HandleIpcExtensionHostHelperProcess from '../HandleIpcExtensionHostHelperProcess/HandleIpcExtensionHostHelperProcess.ts'
import * as HandleIpcFileSystemProcess from '../HandleIpcFileSystemProcess/HandleIpcFileSystemProcess.ts'
import * as HandleIpcProcessExplorer from '../HandleIpcProcessExplorer/HandleIpcProcessExplorer.ts'
import * as HandleIpcSearchProcess from '../HandleIpcSearchProcess/HandleIpcSearchProcess.ts'
import * as HandleIpcSharedProcess from '../HandleIpcSharedProcess/HandleIpcSharedProcess.ts'
import * as HandleIpcTerminalProcess from '../HandleIpcTerminalProcess/HandleIpcTerminalProcess.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const getModule = (ipcId) => {
  Assert.number(ipcId)
  switch (ipcId) {
    case IpcId.AuthProcess:
      return HandleIpcAuthProcess
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
    case IpcId.FileSystemProcess:
      return HandleIpcFileSystemProcess
    case IpcId.ClipBoardProcess:
      return HandleIpcClipBoardProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
