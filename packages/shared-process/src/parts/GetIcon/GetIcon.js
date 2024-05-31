import * as IsLinux from '../IsLinux/IsLinux.js'
import * as IsWindows from '../IsWindows/IsWindows.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'

export const getIcon = () => {
  if (!Platform.isProduction && IsLinux.isLinux) {
    return Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  if (!Platform.isProduction && IsWindows.isWindows) {
    return Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  if (Platform.isProduction && Platform.isArchLinux) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  if (Platform.isProduction && Platform.isAppImage) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  return undefined
}
