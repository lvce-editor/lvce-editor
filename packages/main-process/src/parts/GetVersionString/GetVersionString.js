const Platform = require('../Platform/Platform.cjs')

exports.getVersionString = () => {
  const version = Platform.version
  return version
}
