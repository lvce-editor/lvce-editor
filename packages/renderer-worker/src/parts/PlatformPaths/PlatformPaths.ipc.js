import * as PlatformPaths from './PlatformPaths.js'

export const name = 'PlatformPaths'

export const Commands = {
  getLogsDir: PlatformPaths.getLogsDir,
  getTmpDir: PlatformPaths.getTmpDir,
  getCachePath: PlatformPaths.getCachePath,
  getCacheUri: PlatformPaths.getCacheUri,
  getDisabledExtensionsJsonPath: PlatformPaths.getDisabledExtensionsJsonPath,
}
