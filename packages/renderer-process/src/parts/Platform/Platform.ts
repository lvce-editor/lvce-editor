import * as PlatformType from '../PlatformType/PlatformType.ts'

/**
 * @returns {number}
 */
const getPlatform = () => {
  // @ts-expect-error
  if (typeof PLATFORM !== 'undefined') {
    // @ts-expect-error
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Remote
  }
  if (globalThis.isElectron) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform()
