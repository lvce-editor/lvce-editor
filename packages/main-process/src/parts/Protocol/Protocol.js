const ElectronProtocol = require('../ElectronProtocol/ElectronProtocol.js')
const Platform = require('../Platform/Platform.js')

exports.enable = () => {
  ElectronProtocol.registerSchemesAsPrivileged([
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
