const Platform = require('../Platform/Platform.js')

exports.getHelpString = () => {
  return `${Platform.productName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
