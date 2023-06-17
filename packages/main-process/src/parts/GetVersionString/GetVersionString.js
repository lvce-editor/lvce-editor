const Platform = require('../Platform/Platform.js')

exports.getVersionString = () => {
  const version = Platform.version
  return version
}
