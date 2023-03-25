const Platform = require('../Platform/Platform.js')

exports.isAutoUpdateSupported = () => {
  return Platform.isWindows || Platform.isMacOs
}
