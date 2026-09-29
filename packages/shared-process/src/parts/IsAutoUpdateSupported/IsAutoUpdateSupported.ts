import * as Platform from '../Platform/Platform.ts'

export const isAutoUpdateSupported = (): any => {
  return true
  // return Platform.isWindows || Platform.isMacOs
}

export const useElectronBuilderAutoUpdate = (): any => {
  return Platform.isWindows
}
