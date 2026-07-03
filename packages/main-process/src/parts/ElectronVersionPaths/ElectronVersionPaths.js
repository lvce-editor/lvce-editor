import { join, normalize, resolve } from 'node:path'

export const getElectronExecutablePath = ({ electronPath, platform }) => {
  if (platform === 'darwin') {
    return join(electronPath, 'Electron.app', 'Contents', 'MacOS', 'Electron')
  }
  if (platform === 'win32') {
    return join(electronPath, 'electron.exe')
  }
  return join(electronPath, 'electron')
}

export const getElectronVersionCachePath = ({ arch, electronVersion, platform, userDataPath, lvceRoot }) => {
  const cacheRoot = lvceRoot ? join(lvceRoot, 'build', '.tmp', 'cachedElectronVersions') : join(userDataPath, 'electronVersions')
  return join(cacheRoot, `electron-${electronVersion}-${platform}-${arch}`)
}

const isPathLikeArg = (arg) => {
  return arg && !arg.startsWith('-')
}

const isAppPathArg = ({ arg, appPath, cwd }) => {
  if (!isPathLikeArg(arg)) {
    return false
  }
  return normalize(resolve(cwd, arg)) === normalize(resolve(appPath))
}

export const getElectronUserArgv = ({ appPath, argv, cwd }) => {
  if (argv.length > 1 && isAppPathArg({ arg: argv[1], appPath, cwd })) {
    return argv.slice(2)
  }
  return argv.slice(1)
}
