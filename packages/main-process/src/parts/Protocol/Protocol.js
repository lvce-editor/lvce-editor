import * as Platform from '../Platform/Platform.js'
import * as IsProtocolHandleApiSupported from '../IsProtocolHandleApiSupported/IsProtocolHandleApiSupported.js'

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

export const enable = (protocol) => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: Platform.scheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
      },
    },
  ])
}
