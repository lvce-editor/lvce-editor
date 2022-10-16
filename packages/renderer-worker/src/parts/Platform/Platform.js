import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
/* istanbul ignore file */

// TODO this should always be completely tree shaken out during build, maybe need to be marked as @__Pure for terser to work

// TODO treeshake this function out when targeting electron

export const isMobileOrTablet = () => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return false
  }
  // @ts-ignore
  const userAgentData = navigator.userAgentData
  if (userAgentData && 'mobile' in userAgentData) {
    userAgentData.mobile
  }
  return false
}

const getIsChrome = () => {
  if (typeof navigator === 'undefined') {
    return false
  }
  if (
    // @ts-ignore
    navigator.userAgentData &&
    // @ts-ignore
    navigator.userAgentData.brands
  ) {
    // @ts-ignore
    return navigator.userAgentData.brands.includes('Chromium')
  }
  return false
}

export const isChrome = getIsChrome()

const getIsFirefox = () => {
  if (typeof navigator === 'undefined') {
    return false
  }
  if (
    // @ts-ignore
    navigator.userAgentData &&
    // @ts-ignore
    navigator.userAgentData.brands
  ) {
    // @ts-ignore
    return navigator.userAgentData.brands.includes('Firefox')
  }
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1
}

export const isFirefox = getIsFirefox()

export const getExtensionsPath = () => {
  return SharedProcess.invoke(
    /* Platform.getExtensionsPath */ 'Platform.getExtensionsPath'
  )
}

export const getBuiltinExtensionsPath = () => {
  return SharedProcess.invoke(
    /* Platform.getBuiltinExtensionsPath */ 'Platform.getBuiltinExtensionsPath'
  )
}

export const getDisabledExtensionsPath = () => {
  return SharedProcess.invoke(
    /* Platform.getDisabledExtensionsPath */ 'Platform.getDisabledExtensionsPath'
  )
}

export const getCachedExtensionsPath = () => {
  return SharedProcess.invoke(
    /* Platform.getCachedExtensionsPath */ 'Platform.getCachedExtensionsPath'
  )
}

export const getMarketPlaceUrl = () => {
  // TODO this should be configurable via settings
  // TODO in web this should be static
  return SharedProcess.invoke(
    /* Platform.getMarketPlaceUrl */ 'Platform.getMarketplaceUrl'
  )
}

export const getLogsDir = () => {
  return SharedProcess.invoke(/* Platform.getLogsDir */ 'Platform.getLogsDir')
}

export const getUserSettingsPath = () => {
  if (platform === PlatformType.Web) {
    return 'settings'
  }
  return SharedProcess.invoke(
    /* Platform.getUserSettingsPath */ 'Platform.getUserSettingsPath'
  )
}

/**
 * @returns {'electron'|'remote'|'web'|'test'}
 */
const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'test'
  }
  if (typeof location !== 'undefined' && location.search === '?web') {
    return PlatformType.Web
  }
  if (
    typeof location !== 'undefined' &&
    location.search.includes('platform=electron')
  ) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()

export const getAssetDir = () => {
  // @ts-ignore
  if (typeof ASSET_DIR !== 'undefined') {
    // @ts-ignore
    return ASSET_DIR
  }
  if (platform === PlatformType.Electron) {
    return '../../../../..'
  }
  return ''
}

export const getRecentlyOpenedPath = () => {
  if (platform === PlatformType.Web) {
    return 'recently-opened'
  }
  return SharedProcess.invoke(
    /* Platform.getRecentlyOpenedPath */ 'Platform.getRecentlyOpenedPath'
  )
}

export const getConfigPath = () => {
  return SharedProcess.invoke(
    /* Platform.getConfigDir */ 'Platform.getConfigDir'
  )
}

export const getCachePath = () => {
  return SharedProcess.invoke(/* Platform.getCacheDir */ 'Platform.getCacheDir')
}

export const getExtensionHostWorkerUrl = () => {
  const assetDir = getAssetDir()
  return `${assetDir}/packages/extension-host-worker/src/extensionHostWorkerMain.js`
}

export const getWebExtensionsUrl = () => {
  const assetDir = getAssetDir()
  return `${assetDir}/config/webExtensions.json`
}

export const getGithubApiUrl = () => {
  return `https://api.github.com`
}

export const getCacheName = () => {
  return 'lvce-runtime'
}

const getTestPathRemote = () => {
  return SharedProcess.invoke(/* Platform.getTestPath */ 'Platform.getTestPath')
}

const getTestPathWeb = () => {
  return '/packages/extension-host-worker-tests'
}

export const getTestPath = () => {
  switch (platform) {
    case PlatformType.Electron:
    case PlatformType.Remote:
      return getTestPathRemote()
    case PlatformType.Web:
      return getTestPathWeb()
  }
}

export const getNodePath = () => {
  if (platform === PlatformType.Web) {
    throw new Error('not implemented in web')
  }
  return SharedProcess.invoke(/* Platform.getNodePath */ 'Platform.getNodePath')
}

export const getTmpDir = () => {
  if (platform === PlatformType.Web) {
    throw new Error('not implemented in web')
  }
  return SharedProcess.invoke(/* Platform.getTmpDir */ 'Platform.getTmpDir')
}

export const browserViewZindexWorkaroundEnabled = true
