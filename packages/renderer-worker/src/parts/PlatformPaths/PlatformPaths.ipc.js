import * as PlatformPaths from './PlatformPaths.js'

export const name = 'PlatformPaths'

export const Commands = {
  'Platform.getUserDataDir': PlatformPaths.getUserDataDir,
  getBuiltinExtensionsPath: PlatformPaths.getBuiltinExtensionsPath,
  getLogsDir: PlatformPaths.getLogsDir,
  getTmpDir: PlatformPaths.getTmpDir,
  getCachePath: PlatformPaths.getCachePath,
  getCacheUri: PlatformPaths.getCacheUri,
  getDisabledExtensionsJsonPath: PlatformPaths.getDisabledExtensionsJsonPath,
  getConfigJsonPath: PlatformPaths.getConfigJsonPath,
  getUserDataDir: PlatformPaths.getUserDataDir,
}
