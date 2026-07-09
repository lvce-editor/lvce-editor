import * as HandleWebSocketForClipBoardProcess from '../HandleWebSocketForClipBoardProcess/HandleWebSocketForClipBoardProcess.ts'
import * as HandleWebSocketForExtensionHostHelperProcess from '../HandleWebSocketForExtensionHostHelperProcess/HandleWebSocketForExtensionHostHelperProcess.ts'
import * as HandleWebSocketForFileSystemProcess from '../HandleWebSocketForFileSystemProcess/HandleWebSocketForFileSystemProcess.ts'
import * as HandleWebSocketForProcessExplorer from '../HandleWebSocketForProcessExplorer/HandleWebSocketForProcessExplorer.ts'
import * as HandleWebSocketForSearchProcess from '../HandleWebSocketForSearchProcess/HandleWebSocketForSearchProcess.ts'
import * as HandleWebSocketForSharedProcess from '../HandleWebSocketForSharedProcess/HandleWebSocketForSharedProcess.ts'
import * as HandleWebSocketForTerminalProcess from '../HandleWebSocketForTerminalProcess/HandleWebSocketForTerminalProcess.ts'
import * as HandleWebSocketForUnknown from '../HandleWebSocketForUnknown/HandleWebSocketForUnknown.ts'
import * as ProtocolType from '../ProtocolType/ProtocolType.ts'
import { VError } from '../VError/VError.ts'

export const load = (protocol) => {
  if (!protocol) {
    throw new VError('missing sec websocket protocol header')
  }
  switch (protocol) {
    case ProtocolType.SharedProcess:
      return HandleWebSocketForSharedProcess
    case ProtocolType.ClipBoardProcess:
      return HandleWebSocketForClipBoardProcess
    case ProtocolType.ExtensionHostHelperProcess:
      return HandleWebSocketForExtensionHostHelperProcess
    case ProtocolType.TerminalProcess:
      return HandleWebSocketForTerminalProcess
    case ProtocolType.SearchProcess:
      return HandleWebSocketForSearchProcess
    case ProtocolType.ProcessExplorer:
      return HandleWebSocketForProcessExplorer
    case ProtocolType.FileSystemProcess:
      return HandleWebSocketForFileSystemProcess
    default:
      return HandleWebSocketForUnknown
  }
}
