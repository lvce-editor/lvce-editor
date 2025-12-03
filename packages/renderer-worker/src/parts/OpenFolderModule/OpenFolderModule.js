import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const load = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
      return import('../OpenFolderWeb/OpenFolderWeb.js')
    case PlatformType.Remote:
      return import('../OpenFolderRemote/OpenFolderRemote.js')
    case PlatformType.Electron:
      return import('../OpenFolderElectron/OpenFolderElectron.js')
    default:
      throw new Error('unsupported platform')
  }
}
