import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const reloadWeb = () => {
  return RendererProcess.invoke('Window.reload')
}

const reloadRemote = () => {
  return RendererProcess.invoke('Window.reload')
}

const reloadElectron = () => {
  return ElectronWindow.reload()
}

const getFn = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return reloadWeb
    case PlatformType.Remote:
      return reloadRemote
    case PlatformType.Electron:
      return reloadElectron
    default:
      throw new Error('unexpected platform')
  }
}

export const reload = () => {
  const fn = getFn()
  return fn()
}
