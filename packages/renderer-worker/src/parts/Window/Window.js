import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

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
    case 'web':
      return reloadWeb()
    case 'remote':
      return reloadRemote()
    case 'electron':
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
    case 'web':
      return minimizeWeb()
    case 'remote':
      return minimizeRemote()
    case 'electron':
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
    case 'web':
      return maximizeWeb()
    case 'remote':
      return maximizeRemote()
    case 'electron':
      return maximizeElectron()
    default:
      return
  }
}

const unmaximizeWeb = () => {}

const unmaximizeRemote = () => {}

const unmaximizeElectron = () => {}

export const unmaximize = async () => {
  switch (Platform.platform) {
    case 'web':
      return unmaximizeWeb()
    case 'remote':
      return unmaximizeRemote()
    case 'electron':
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
    case 'web':
      return closeWeb()
    case 'remote':
      return closeRemote()
    case 'electron':
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
    case 'web':
      return exitWeb()
    case 'remote':
      return exitRemote()
    case 'electron':
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
    case 'web':
      return openNewWeb()
    case 'remote':
      return openNewRemote()
    case 'electron':
      return openNewElectron()
    default:
      return
  }
}
