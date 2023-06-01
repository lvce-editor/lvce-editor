const Platform = require('../Platform/Platform.js')
const ElectronProtocolType = require('../ElectronProtocolType/ElectronProtocolType.js')

exports.handle = (protocol, name, type, handleRequest) => {
  if (protocol.handle) {
    protocol.handle(name, handleRequest)
    return
  }
  switch (type) {
    case ElectronProtocolType.File:
      const wrappedHandleRequest = (request, callback) => {
        const result = handleRequest(request)
        callback(result)
      }
      protocol.registerFileProtocol(name, wrappedHandleRequest)
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
