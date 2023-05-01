import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Platform from '../Platform/Platform.js'

const getModule = async () => {
  switch (Platform.platform) {
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
