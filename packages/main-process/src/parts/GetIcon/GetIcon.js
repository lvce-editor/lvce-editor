import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

export const getIcon = () => {
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
