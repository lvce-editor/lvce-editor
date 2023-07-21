const Platform = require('../Platform/Platform.cjs')
const IsProtocolHandleApiSupported = require('../IsProtocolHandleApiSupported/IsProtocolHandleApiSupported.cjs')

/**
 *
 * @param {Electron.Protocol} protocol
 * @param {string} name
 * @param {(request: GlobalRequest) => Promise<GlobalResponse>} handleRequest
 * @returns
 */
exports.handle = (protocol, name, handleRequest) => {
  if (IsProtocolHandleApiSupported.isProtocolHandleApiSupported(protocol)) {
    protocol.handle(name, handleRequest)
    return
  }
  throw new Error('protocol.handle api is not supported')
}

exports.enable = (protocol) => {
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
