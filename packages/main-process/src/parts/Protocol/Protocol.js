import * as IsProtocolHandleApiSupported from '../IsProtocolHandleApiSupported/IsProtocolHandleApiSupported.js'
import * as PrivilegedSchemes from '../PrivilegedSchemes/PrivilegedSchemes.js'

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
  protocol.registerSchemesAsPrivileged(PrivilegedSchemes.privilegedSchems)
}
