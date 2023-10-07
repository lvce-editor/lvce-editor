import * as IsWindows from '../IsWindows/IsWindows.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getElectronRebuildPath = () => {
  if (IsWindows.isWindows) {
    return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild.cmd')
  }
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}
