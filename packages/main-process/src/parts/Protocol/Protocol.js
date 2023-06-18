const Platform = require('../Platform/Platform.js')
const ElectronProtocolType = require('../ElectronProtocolType/ElectronProtocolType.js')
const IsProtocolHandleApiSupported = require('../IsProtocolHandleApiSupported/IsProtocolHandleApiSupported.js')

/**
 *
 * @param {Electron.Protocol} protocol
 * @param {string} name
 * @param {number} type
 * @param {(request: globalThis.Electron.ProtocolRequest) => Promise<GlobalResponse>} handleRequest
 * @returns
 */
exports.handle = (protocol, name, type, handleRequest, handleRequestFile) => {
  if (IsProtocolHandleApiSupported.isProtocolHandleApiSupported(protocol)) {
    protocol.handle(name, handleRequest)
    return
  }
  switch (type) {
    case ElectronProtocolType.File:
      protocol.registerFileProtocol(name, handleRequestFile)
      break
    default:
      throw new Error('unsupported type')
  }
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
