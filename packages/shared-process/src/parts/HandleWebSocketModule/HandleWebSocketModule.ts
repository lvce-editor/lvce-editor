import * as HandleWebSocketForClipBoardProcess from '../HandleWebSocketForClipBoardProcess/HandleWebSocketForClipBoardProcess.ts'
import * as HandleWebSocketForExtensionNodeProcess from '../HandleWebSocketForExtensionNodeProcess/HandleWebSocketForExtensionNodeProcess.ts'
import * as HandleWebSocketForFileSystemProcess from '../HandleWebSocketForFileSystemProcess/HandleWebSocketForFileSystemProcess.ts'
import * as HandleWebSocketForFileWatcherExplorer from '../HandleWebSocketForFileWatcherExplorer/HandleWebSocketForFileWatcherExplorer.ts'
import * as HandleWebSocketForProcessExplorer from '../HandleWebSocketForProcessExplorer/HandleWebSocketForProcessExplorer.ts'
import * as HandleWebSocketForSearchProcess from '../HandleWebSocketForSearchProcess/HandleWebSocketForSearchProcess.ts'
import * as HandleWebSocketForSharedProcess from '../HandleWebSocketForSharedProcess/HandleWebSocketForSharedProcess.ts'
import * as HandleWebSocketForTerminalProcess from '../HandleWebSocketForTerminalProcess/HandleWebSocketForTerminalProcess.ts'
import * as HandleWebSocketForUnknown from '../HandleWebSocketForUnknown/HandleWebSocketForUnknown.ts'
import * as ProtocolType from '../ProtocolType/ProtocolType.ts'
import { VError } from '../VError/VError.ts'

export const load = (protocol: any): any => {
  if (!protocol) {
    throw new VError('missing sec websocket protocol header')
  }
  switch (protocol) {
    case ProtocolType.ClipBoardProcess:
      return HandleWebSocketForClipBoardProcess
    case ProtocolType.ExtensionNodeProcess:
      return HandleWebSocketForExtensionNodeProcess
    case ProtocolType.FileSystemProcess:
      return HandleWebSocketForFileSystemProcess
    case ProtocolType.FileWatcherExplorer:
      return HandleWebSocketForFileWatcherExplorer
    case ProtocolType.ProcessExplorer:
      return HandleWebSocketForProcessExplorer
    case ProtocolType.SearchProcess:
      return HandleWebSocketForSearchProcess
    case ProtocolType.SharedProcess:
      return HandleWebSocketForSharedProcess
    case ProtocolType.TerminalProcess:
      return HandleWebSocketForTerminalProcess
    default:
      return HandleWebSocketForUnknown
  }
}
