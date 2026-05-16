import { existsSync } from 'fs'
import { join } from 'path'

const getLegacyElectronPath = (root, platform) => {
  if (platform === 'darwin') {
    return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'Electron.app', 'Contents', 'MacOS', 'Electron')
  }
  if (platform === 'win32') {
    return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron.exe')
  }
  return join(root, 'packages', 'main-process', 'node_modules', 'electron', 'dist', 'electron')
}

export const resolveElectronPath = ({ root, platform, requireFromMainProcess, existsSyncFn = existsSync }) => {
  try {
    const electronPath = requireFromMainProcess('electron')
    if (typeof electronPath === 'string' && electronPath && existsSyncFn(electronPath)) {
      return electronPath
    }
  } catch {
    // fall back to the legacy dist path below
  }
  return getLegacyElectronPath(root, platform)
}
