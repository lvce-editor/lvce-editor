import * as IsLinux from '../IsLinux/IsLinux.ts'
import * as IsProduction from '../IsProduction/IsProduction.ts'
import * as IsWindows from '../IsWindows/IsWindows.ts'
import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const getIcon = (): any => {
  if (IsLinux.isLinux) {
    return IsProduction.isProduction
      ? Path.join(Root.root, 'static', 'icons', 'icon.png')
      : Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  if (!IsProduction.isProduction && IsWindows.isWindows) {
    return Path.join(Root.root, 'packages', 'build', 'files', 'icon.png')
  }
  return undefined
}
