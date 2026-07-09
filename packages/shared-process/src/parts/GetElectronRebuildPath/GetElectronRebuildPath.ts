import * as IsWindows from '../IsWindows/IsWindows.ts'
import * as Path from '../Path/Path.ts'
import * as Root from '../Root/Root.ts'

export const getElectronRebuildPath = () => {
  if (IsWindows.isWindows) {
    return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild.cmd')
  }
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}
