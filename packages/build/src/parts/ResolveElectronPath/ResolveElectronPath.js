import { existsSync } from 'fs'
import { join } from 'path'

const getElectronCliPath = root => {
  return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'cli.js')
}

const getLegacyElectronPath = (root, platform) => {
  if (platform === 'darwin') {
    return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')
  }
  if (platform === 'win32') {
    return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron.exe')
  }
  return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron')
}

export const resolveElectronLaunch = ({ root, platform, existsSyncFn = existsSync, nodePath = process.execPath }) => {
  const electronCliPath = getElectronCliPath(root)
  if (existsSyncFn(electronCliPath)) {
    return {
      command: nodePath,
      argsPrefix: [electronCliPath],
    }
  }
  return {
    command: getLegacyElectronPath(root, platform),
    argsPrefix: [],
  }
}
