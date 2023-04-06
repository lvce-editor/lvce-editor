import * as PlatformType from '../PlatformType/PlatformType.js'

// TODO duplicate code with platform module
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

const platform = getPlatform() // TODO tree-shake this out in production

const getModule = () => {
  switch (platform) {
    case PlatformType.Web:
    case PlatformType.Remote:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case PlatformType.Electron:
      return import('../IpcParentWithElectron/IpcParentWithElectron.js')
    default:
      throw new Error('unsupported platform')
  }
}

export const create = async (options) => {
  const module = await getModule()
  const rawIpc = await module.create(options)
  if (options.raw) {
    return rawIpc
  }
  return {
    rawIpc,
    module,
  }
}

export const wrap = ({ rawIpc, module }) => {
  return module.wrap(rawIpc)
}
