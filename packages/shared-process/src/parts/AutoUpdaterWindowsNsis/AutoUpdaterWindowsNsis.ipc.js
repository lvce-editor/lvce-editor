import * as AutoUpdaterWindowsNsis from './AutoUpdaterWindowsNsis.js'

export const name = 'AutoUpdaterWindowsNsis'

export const Commands = {
  downloadUpdate: AutoUpdaterWindowsNsis.downloadUpdate,
  installAndRestart: AutoUpdaterWindowsNsis.installAndRestart,
}
