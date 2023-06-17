const Platform = require('../Platform/Platform.js')

exports.getHelpString = () => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
