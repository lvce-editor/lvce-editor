import * as Platform from '../Platform/Platform.ts'

export const isAutoUpdateSupported = () => {
  return true
  // return Platform.isWindows || Platform.isMacOs
}

export const useElectronBuilderAutoUpdate = () => {
  return Platform.isWindows
}
