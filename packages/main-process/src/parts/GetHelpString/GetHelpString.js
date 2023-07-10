const Platform = require('../Platform/Platform.cjs')

exports.getHelpString = () => {
  return `${Platform.applicationName} v${Platform.version}

Usage:
  ${Platform.applicationName} [path]
`
}
