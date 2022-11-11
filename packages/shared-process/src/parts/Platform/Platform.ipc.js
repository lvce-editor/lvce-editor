import * as Platform from '../Platform/Platform.js'

export const name = 'Platform'

// prettier-ignore
export const Commands = {
  getAppDir: Platform.getAppDir,
  getBuiltinExtensionsPath: Platform.getBuiltinExtensionsPath,
  getCachedExtensionsPath: Platform.getCachedExtensionsPath,
  getCacheDir: Platform.getCacheDir,
  getConfigDir: Platform.getConfigDir,
  getDataDir: Platform.getDataDir,
  getDisabledExtensionsPath: Platform.getDisabledExtensionsPath,
  getDownloadDir: Platform.getDownloadDir,
  getExtensionsPath: Platform.getExtensionsPath,
  getHomeDir: Platform.getHomeDir,
  getLogsDir: Platform.getLogsDir,
  getMarketplaceUrl: Platform.getMarketplaceUrl,
  getNodePath: Platform.getNodePath,
  getRecentlyOpenedPath: Platform.getRecentlyOpenedPath,
  getTestPath: Platform.getTestPath,
  getTmpDir: Platform.getTmpDir,
  getUserSettingsPath: Platform.getUserSettingsPath,
  setEnvironmentVariables: Platform.setEnvironmentVariables,
}
