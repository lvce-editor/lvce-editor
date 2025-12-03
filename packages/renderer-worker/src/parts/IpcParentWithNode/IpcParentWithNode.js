import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getModule = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
    case PlatformType.Remote:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.js')
    case PlatformType.Electron:
      return import('../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.js')
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
