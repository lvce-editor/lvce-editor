import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getElectronRebuildPath = () => {
  if (IsElectron.isElectron()) {
    return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild.cmd')
  }
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}
