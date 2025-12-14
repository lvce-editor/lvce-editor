import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
/* istanbul ignore file */

// TODO this should always be completely tree shaken out during build, maybe need to be marked as @__Pure for terser to work

// TODO treeshake this function out when targeting electron

export const getExtensionsPath = () => {
  return SharedProcess.invoke(/* Platform.getExtensionsPath */ 'Platform.getExtensionsPath')
}

export const getBuiltinExtensionsPath = () => {
  return SharedProcess.invoke(/* Platform.getBuiltinExtensionsPath */ 'Platform.getBuiltinExtensionsPath')
}

export const getDisabledExtensionsPath = () => {
  return SharedProcess.invoke(/* Platform.getDisabledExtensionsPath */ 'Platform.getDisabledExtensionsPath')
}

export const getDisabledExtensionsJsonPath = () => {
  return SharedProcess.invoke(/* Platform.getDisabledExtensionsJsonPath */ 'Platform.getDisabledExtensionsJsonPath')
}

export const getCachedExtensionsPath = () => {
  return SharedProcess.invoke(/* Platform.getCachedExtensionsPath */ 'Platform.getCachedExtensionsPath')
}

export const getMarketPlaceUrl = () => {
  // TODO this should be configurable via settings
  // TODO in web this should be static
  return SharedProcess.invoke(/* Platform.getMarketPlaceUrl */ 'Platform.getMarketplaceUrl')
}

export const getLogsDir = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return 'memfs://output'
  }
  return SharedProcess.invoke(/* Platform.getLogsDir */ 'Platform.getLogsDir')
}

export const getDownloadDir = () => {
  return SharedProcess.invoke(/* Platform.getDownloadDir */ 'Platform.getDownloadDir')
}

export const getUserSettingsPath = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return 'settings'
  }
  return SharedProcess.invoke(/* Platform.getUserSettingsPath */ 'Platform.getUserSettingsPath')
}

export const getUserKeyBindingsPath = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return 'settings'
  }
  return SharedProcess.invoke(/* Platform.getUserSettingsPath */ 'Platform.getUserKeyBindingsPath')
}

export const getRecentlyOpenedPath = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return 'recently-opened'
  }
  return SharedProcess.invoke(/* Platform.getRecentlyOpenedPath */ 'Platform.getRecentlyOpenedPath')
}

export const getConfigPath = () => {
  return SharedProcess.invoke(/* Platform.getConfigDir */ 'Platform.getConfigDir')
}

export const getCachePath = () => {
  return SharedProcess.invoke(/* Platform.getCacheDir */ 'Platform.getCacheDir')
}

export const getCacheUri = () => {
  return SharedProcess.invoke(/* Platform.getCacheDir */ 'Platform.getCacheUri')
}

export const getExtensionHostWorkerUrl = () => {
  return `${AssetDir.assetDir}/packages/extension-host-worker/src/extensionHostWorkerMain.ts`
}

export const getGithubApiUrl = () => {
  return 'https://api.github.com'
}

export const getCacheName = () => {
  return 'lvce-runtime'
}

const getTestPathRemote = () => {
  return SharedProcess.invoke(/* Platform.getTestPath */ 'Platform.getTestPath')
}

const getTestPathWeb = () => {
  return `${AssetDir.assetDir}/packages/extension-host-worker-tests`
}

// @ts-ignore
export const getTestPath = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Electron:
    case PlatformType.Remote:
      return getTestPathRemote()
    case PlatformType.Web:
      return getTestPathWeb()
  }
}

export const getNodePath = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    throw new Error('not implemented in web')
  }
  return SharedProcess.invoke(/* Platform.getNodePath */ 'Platform.getNodePath')
}

export const getTmpDir = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    throw new Error('not implemented in web')
  }
  return SharedProcess.invoke(/* Platform.getTmpDir */ 'Platform.getTmpDir')
}

export const browserViewZindexWorkaroundEnabled = true

export const getRepository = () => {
  return SharedProcess.invoke('Platform.getRepository')
}

export const getApplicationName = () => {
  return SharedProcess.invoke('Platform.getApplicationName')
}
