import * as PlatformType from '../PlatformType/PlatformType.js'

/**
 * @returns {'electron'|'remote'|'web'}
 */
const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Remote
  }
  // @ts-ignore
  if (typeof myApi !== 'undefined') {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()
