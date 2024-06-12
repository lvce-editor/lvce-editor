import * as HandleWebSocketForExtensionHostHelperProcess from '../HandleWebSocketForExtensionHostHelperProcess/HandleWebSocketForExtensionHostHelperProcess.js'
import * as HandleWebSocketForSearchProcess from '../HandleWebSocketForSearchProcess/HandleWebSocketForSearchProcess.js'
import * as HandleWebSocketForSharedProcess from '../HandleWebSocketForSharedProcess/HandleWebSocketForSharedProcess.js'
import * as HandleWebSocketForTerminalProcess from '../HandleWebSocketForTerminalProcess/HandleWebSocketForTerminalProcess.js'
import * as HandleWebSocketForUnknown from '../HandleWebSocketForUnknown/HandleWebSocketForUnknown.js'
import * as ProtocolType from '../ProtocolType/ProtocolType.js'
import { VError } from '../VError/VError.js'

export const load = (protocol) => {
  if (!protocol) {
    throw new VError('missing sec websocket protocol header')
  }
  switch (protocol) {
    case ProtocolType.SharedProcess:
      return HandleWebSocketForSharedProcess
    case ProtocolType.ExtensionHostHelperProcess:
      return HandleWebSocketForExtensionHostHelperProcess
    case ProtocolType.TerminalProcess:
      return HandleWebSocketForTerminalProcess
    case ProtocolType.SearchProcess:
      return HandleWebSocketForSearchProcess
    default:
      return HandleWebSocketForUnknown
  }
}
