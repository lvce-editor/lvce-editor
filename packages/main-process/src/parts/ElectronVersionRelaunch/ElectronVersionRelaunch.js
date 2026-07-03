import { app } from 'electron'
import { spawn } from 'node:child_process'
import * as ElectronVersionCache from '../ElectronVersionCache/ElectronVersionCache.js'
import * as ElectronVersionCliArgs from '../ElectronVersionCliArgs/ElectronVersionCliArgs.js'
import * as ElectronVersionPaths from '../ElectronVersionPaths/ElectronVersionPaths.js'

export const maybeRelaunchWithElectronVersion = async ({
  appPath = app.getAppPath(),
  arch = process.arch,
  argv = process.argv,
  cwd = process.cwd(),
  env = process.env,
  exitFn = app.exit.bind(app),
  getUserDataPath = () => app.getPath('userData'),
  log = console,
  platform = process.platform,
  spawnFn = spawn,
} = {}) => {
  const userArgv = ElectronVersionPaths.getElectronUserArgv({
    appPath,
    argv,
    cwd,
  })
  const electronVersionArg = ElectronVersionCliArgs.parseElectronVersionCliArgs(userArgv)
  if (!electronVersionArg) {
    return false
  }
  log.info(`[electron-version] requested Electron ${electronVersionArg.electronVersion}`)
  const cachePath = ElectronVersionPaths.getElectronVersionCachePath({
    arch,
    electronVersion: electronVersionArg.electronVersion,
    platform,
    userDataPath: env.LVCE_ROOT ? '' : getUserDataPath(),
    lvceRoot: env.LVCE_ROOT,
  })
  const executablePath = await ElectronVersionCache.ensureElectronVersion({
    arch,
    cachePath,
    electronVersion: electronVersionArg.electronVersion,
    log,
    platform,
  })
  log.info(`[electron-version] launching ${executablePath}`)
  const child = spawnFn(executablePath, [appPath, ...electronVersionArg.filteredArgv], {
    cwd: appPath,
    detached: true,
    env,
    stdio: 'ignore',
  })
  child.unref()
  exitFn(0)
  return true
}
