import * as PlatformType from '../PlatformType/PlatformType.js'

const getPlatform = () => {
  // @ts-ignore
  if (typeof PLATFORM !== 'undefined') {
    // @ts-ignore
    return PLATFORM
  }
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return 'test'
  }
  // TODO find a better way to pass runtime environment
  if (typeof name !== 'undefined' && name.endsWith('(Electron)')) {
    return PlatformType.Electron
  }
  return PlatformType.Remote
}

export const platform = getPlatform() // TODO tree-shake this out in production
