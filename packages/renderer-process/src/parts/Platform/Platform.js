import * as PlatformType from '../PlatformType/PlatformType.js'
/* istanbul ignore file */

// TODO this should always be completely tree shaken out during build

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

// TODO treeshake this function out when targeting electron

export const state = {
  isElectron() {
    return (
      // @ts-ignore
      window.myApi &&
      // @ts-ignore
      window.myApi.ipcConnect &&
      // @ts-ignore
      typeof window.myApi.ipcConnect === 'function'
    )
  },
}

export const isElectron = () => {
  return state.isElectron()
}
