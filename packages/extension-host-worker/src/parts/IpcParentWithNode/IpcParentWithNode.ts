import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as Platform from '../Platform/Platform.ts'

const getModule = async () => {
  switch (Platform.platform) {
    case PlatformType.Remote:
      return import('../IpcParentWithWebSocket/IpcParentWithWebSocket.ts')
    default:
      return import('../IpcParentWithElectronMessagePort/IpcParentWithElectronMessagePort.ts')
  }
}

export const create = async ({ type, raw }) => {
  const module = await getModule()
  const rawIpc = await module.create({ type })
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
