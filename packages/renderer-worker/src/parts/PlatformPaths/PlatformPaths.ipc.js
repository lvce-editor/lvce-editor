import * as PlatformPaths from './PlatformPaths.js'

export const name = 'PlatformPaths'

export const Commands = {
  getBuiltinExtensionsPath: PlatformPaths.getBuiltinExtensionsPath,
  getLogsDir: PlatformPaths.getLogsDir,
  getTmpDir: PlatformPaths.getTmpDir,
  getCachePath: PlatformPaths.getCachePath,
  getCacheUri: PlatformPaths.getCacheUri,
  getDisabledExtensionsJsonPath: PlatformPaths.getDisabledExtensionsJsonPath,
  getConfigJsonPath: PlatformPaths.getConfigJsonPath,
}
