import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'

export const getElectronRebuildPath = () => {
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}
