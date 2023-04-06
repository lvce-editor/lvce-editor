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

const platform = getPlatform() // TODO tree-shake this out in production

const getModule = async () => {
  switch (platform) {
    case PlatformType.Remote:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    default:
      return import('../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.js')
  }
}

export const create = async ({ type, raw, protocol }) => {
  const module = await getModule()
  const rawIpc = await module.create({ type, protocol: 'lvce.extension-host-helper-process' })
  if (raw) {
    return rawIpc
  }
  return {
    module,
    rawIpc,
  }
}

export const wrap = ({ module, rawIpc }) => {
  return module.wrap(rawIpc)
}
