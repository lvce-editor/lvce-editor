const Platform = require('../Platform/Platform.js')

exports.getHelpString = () => {
  return `${Platform.productNameLong} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
