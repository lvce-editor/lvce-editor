import * as IsLinux from '../IsLinux/IsLinux.ts'
import * as IsProduction from '../IsProduction/IsProduction.ts'
import * as IsWindows from '../IsWindows/IsWindows.ts'
import * as Path from '../Path/Path.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Root from '../Root/Root.ts'

export const getIcon = (): any => {
  if (!IsProduction.isProduction && IsLinux.isLinux) {
    return Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  if (!IsProduction.isProduction && IsWindows.isWindows) {
    return Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  if (IsProduction.isProduction && Platform.isArchLinux) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  if (IsProduction.isProduction && Platform.isAppImage) {
    return Path.join(Root.root, 'static', 'icons', 'icon.png')
  }
  return undefined
}
