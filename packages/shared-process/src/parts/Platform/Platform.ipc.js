import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'

export const name = 'Platform'

export const Commands = {
  getAppDir: PlatformPaths.getAppDir,
  getApplicationName: Platform.getApplicationName,
  getBuiltinExtensionsPath: PlatformPaths.getBuiltinExtensionsPath,
  getCachedExtensionsPath: PlatformPaths.getCachedExtensionsPath,
  getCacheDir: PlatformPaths.getCacheDir,
  getCommit: Platform.getCommit,
  getConfigDir: PlatformPaths.getConfigDir,
  getDataDir: PlatformPaths.getDataDir,
  getDate: Platform.getDate,
  getRoot: PlatformPaths.getRoot,
  getRootUri: PlatformPaths.getRootUri,
  getDisabledExtensionsPath: PlatformPaths.getDisabledExtensionsPath,
  getDownloadDir: PlatformPaths.getDownloadDir,
  getExtensionsPath: PlatformPaths.getExtensionsPath,
  getHomeDir: PlatformPaths.getHomeDir,
  getLogsDir: PlatformPaths.getLogsDir,
  getMarketplaceUrl: PlatformPaths.getMarketplaceUrl,
  getNodePath: Platform.getNodePath,
  getProductNameLong: Platform.getProductNameLong,
  getRecentlyOpenedPath: PlatformPaths.getRecentlyOpenedPath,
  getTestPath: PlatformPaths.getTestPath,
  getTmpDir: Platform.getTmpDir,
  getUserKeyBindingsPath: PlatformPaths.getUserKeyBindingsPath,
  getUserSettingsPath: PlatformPaths.getUserSettingsPath,
  getVersion: Platform.getVersion,
  setEnvironmentVariables: Platform.setEnvironmentVariables,
}
