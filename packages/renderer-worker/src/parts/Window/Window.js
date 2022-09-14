import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const reloadWeb = async () => {
  await RendererProcess.invoke(/* windowReload */ 8080)
}

const reloadRemote = async () => {
  await RendererProcess.invoke(/* windowReload */ 8080)
}

const reloadElectron = async () => {
  await ElectronWindow.reload()
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

const minimizeWeb = () => {}

const minimizeRemote = () => {}

const minimizeElectron = () => {
  return ElectronWindow.minimize()
}

export const minimize = async () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return minimizeWeb()
    case PlatformType.Remote:
      return minimizeRemote()
    case PlatformType.Electron:
      return minimizeElectron()
    default:
      return
  }
}

const maximizeWeb = () => {}
const maximizeRemote = () => {}
const maximizeElectron = () => {
  return ElectronWindow.maximize()
}

export const maximize = async () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return maximizeWeb()
    case PlatformType.Remote:
      return maximizeRemote()
    case PlatformType.Electron:
      return maximizeElectron()
    default:
      return
  }
}

const unmaximizeWeb = () => {}

const unmaximizeRemote = () => {}

const unmaximizeElectron = () => {
  return ElectronWindow.unmaximize()
}

export const unmaximize = async () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return unmaximizeWeb()
    case PlatformType.Remote:
      return unmaximizeRemote()
    case PlatformType.Electron:
      return unmaximizeElectron()
    default:
      return
  }
}

const closeWeb = () => {}
const closeRemote = () => {}
const closeElectron = () => {
  return ElectronWindow.close()
}

export const close = async () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return closeWeb()
    case PlatformType.Remote:
      return closeRemote()
    case PlatformType.Electron:
      return closeElectron()
    default:
      return
  }
}

const exitWeb = () => {}
const exitRemote = () => {}
const exitElectron = () => {
  return ElectronApp.exit()
}

export const exit = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return exitWeb()
    case PlatformType.Remote:
      return exitRemote()
    case PlatformType.Electron:
      return exitElectron()
  }
}

export const setTitle = async (title) => {
  await RendererProcess.invoke(
    /* Window.setTitle */ 'Window.setTitle',
    /* title */ title
  )
}

const openNewWeb = () => {}
const openNewRemote = () => {}
const openNewElectron = () => {
  return ElectronWindow.openNew()
}

export const openNew = async () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return openNewWeb()
    case PlatformType.Remote:
      return openNewRemote()
    case PlatformType.Electron:
      return openNewElectron()
    default:
      return
  }
}

export const open = (url, target, features) => {
  return RendererProcess.invoke('Window.open', url, target, features)
}

export const postMessage = (windowId, message) => {
  return RendererProcess.invoke('Window.postMessage', windowId, message)
}
