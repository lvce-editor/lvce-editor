import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getModule = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return import('./ProcessExplorerElectron.js')
    case PlatformType.Remote:
      return import('./ProcessExplorerRemote.js')
    case PlatformType.Web:
      return import('./ProcessExplorerWeb.js')
    default:
      throw new Error('unsupported platform')
  }
}

export const open = async () => {
  const module = await getModule()
  return module.open()
}
