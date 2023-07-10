const Path = require('../Path/Path.cjs')
const Platform = require('../Platform/Platform.cjs')
const Root = require('../Root/Root.cjs')

exports.getIcon = () => {
  if (!Platform.isProduction && Platform.isLinux) {
    return Path.join(Root.root, 'build', 'files', 'icon.png')
  }
  if (!Platform.isProduction && Platform.isWindows) {
    return Path.join(Root.root, 'build', 'files', 'icon.png')
  }
  if (Platform.isProduction && Platform.isArchLinux) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  if (Platform.isProduction && Platform.isAppImage) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  return undefined
}
