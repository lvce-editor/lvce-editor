import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as ReloadElectron from '../ReloadElectron/ReloadElectron.js'
import * as ReloadWeb from '../ReloadWeb/ReloadWeb.js'

const getFn = () => {
  switch (Platform.getPlatform()) {
    case PlatformType.Web:
    case PlatformType.Remote:
      return ReloadWeb.reloadWeb
    case PlatformType.Electron:
      return ReloadElectron.reloadElectron
    default:
      throw new Error('unexpected platform')
  }
}

export const reload = () => {
  const fn = getFn()
  return fn()
}
