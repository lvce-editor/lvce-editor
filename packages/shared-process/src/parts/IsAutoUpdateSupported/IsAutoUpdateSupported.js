import * as Platform from '../Platform/Platform.js'

export const isAutoUpdateSupported = () => {
  return true
  // return Platform.isWindows || Platform.isMacOs
}

export const useElectronBuilderAutoUpdate = () => {
  return Platform.isWindows
}
