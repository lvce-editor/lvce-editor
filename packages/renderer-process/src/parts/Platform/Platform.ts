import * as PlatformType from '../PlatformType/PlatformType.ts'

/**
 * @returns {number}
 */
const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Remote
  }
  // @ts-ignore
  if (globalThis.isElectron) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()
