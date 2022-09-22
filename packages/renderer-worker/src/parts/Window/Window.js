import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const reloadWeb = () => {
  return RendererProcess.invoke('Window.reload')
}

const reloadRemote = () => {
  return RendererProcess.invoke('Window.reload')
}

const reloadElectron = async () => {
  return ElectronWindow.reload()
}

export const reload = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return reloadWeb()
    case PlatformType.Remote:
      return reloadRemote()
    case PlatformType.Electron:
      return reloadElectron()
    default:
      return
  }
}

export const setTitle = async (title) => {
  await RendererProcess.invoke(
    /* Window.setTitle */ 'Window.setTitle',
    /* title */ title
  )
}
