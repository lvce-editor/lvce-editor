import * as Assert from '../Assert/Assert.js'
import * as HandleIpcClipBoardProcess from '../HandleIpcClipBoardProcess/HandleIpcClipBoardProcess.js'
import * as HandleIpcEmbedsProcess from '../HandleIpcEmbedsProcess/HandleIpcEmbedsProcess.js'
import * as HandleIpcExtensionHostHelperProcess from '../HandleIpcExtensionHostHelperProcess/HandleIpcExtensionHostHelperProcess.js'
import * as HandleIpcFileSystemProcess from '../HandleIpcFileSystemProcess/HandleIpcFileSystemProcess.js'
import * as HandleIpcProcessExplorer from '../HandleIpcProcessExplorer/HandleIpcProcessExplorer.js'
import * as HandleIpcSearchProcess from '../HandleIpcSearchProcess/HandleIpcSearchProcess.js'
import * as HandleIpcSharedProcess from '../HandleIpcSharedProcess/HandleIpcSharedProcess.js'
import * as HandleIpcTerminalProcess from '../HandleIpcTerminalProcess/HandleIpcTerminalProcess.js'
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
    case IpcId.FileSystemProcess:
      return HandleIpcFileSystemProcess
    case IpcId.ClipBoardProcess:
      return HandleIpcClipBoardProcess
    default:
      throw new Error(`unexpected incoming ipc`)
  }
}
