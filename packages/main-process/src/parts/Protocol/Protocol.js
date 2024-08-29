import * as Platform from '../Platform/Platform.js'
import * as IsProtocolHandleApiSupported from '../IsProtocolHandleApiSupported/IsProtocolHandleApiSupported.js'
import * as Scheme from '../Scheme/Scheme.js'

/**
 *
 * @param {Electron.Protocol} protocol
 * @param {string} name
 * @param {(request: GlobalRequest) => Promise<GlobalResponse>} handleRequest
 * @returns
 */
export const handle = (protocol, name, handleRequest) => {
  if (IsProtocolHandleApiSupported.isProtocolHandleApiSupported(protocol)) {
    protocol.handle(name, handleRequest)
    return
  }
  throw new Error('protocol.handle api is not supported')
}

/**
 *
 * @param {Electron.Protocol} protocol
 * @returns
 */
export const enable = (protocol) => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: Platform.scheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        codeCache: true,
      },
    },
    {
      scheme: Scheme.WebView,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        codeCache: true,
      },
    },
  ])
}
