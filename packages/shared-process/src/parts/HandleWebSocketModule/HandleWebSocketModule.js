import * as ProtocolType from '../ProtocolType/ProtocolType.js'
import { VError } from '../VError/VError.js'

export const load = (protocol) => {
  if (!protocol) {
    throw new VError('missing sec websocket protocol header')
  }
  switch (protocol) {
    case ProtocolType.SharedProcess:
      return import('../HandleWebSocketForSharedProcess/HandleWebSocketForSharedProcess.js')
    case ProtocolType.ExtensionHost:
      return import('../HandleWebSocketForExtensionHost/HandleWebSocketForExtensionHost.js')
    case ProtocolType.ExtensionHostHelperProcess:
      return import('../HandleWebSocketForExtensionHostHelperProcess/HandleWebSocketForExtensionHostHelperProcess.js')
    case ProtocolType.TerminalProcess:
      return import('../HandleWebSocketForTerminalProcess/HandleWebSocketForTerminalProcess.js')
    default:
      return import('../HandleWebSocketForUnknown/HandleWebSocketForUnknown.js')
  }
}
