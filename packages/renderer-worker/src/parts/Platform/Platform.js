import * as PlatformType from '../PlatformType/PlatformType.js'
/* istanbul ignore file */

// TODO this should always be completely tree shaken out during build, maybe need to be marked as @__Pure for terser to work

// TODO treeshake this function out when targeting electron

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
  // TODO find a better way to pass runtime environment
  if (typeof name !== 'undefined' && name.endsWith('(Electron)')) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()

const getAssetDir = () => {
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

export const assetDir = getAssetDir()
