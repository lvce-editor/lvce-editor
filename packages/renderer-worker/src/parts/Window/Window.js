import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const reload = async () => {
  if (Platform.platform === 'web' || Platform.platform === 'remote') {
    await RendererProcess.invoke(/* windowReload */ 8080)
    return
  }
  if (Platform.platform === 'electron') {
    // TODO should use invoke here
    await SharedProcess.invoke(
      /* Electron.windowReload */ 'Electron.windowReload'
    )
  }
}

export const minimize = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await ElectronWindow.minimize()
}

export const maximize = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await ElectronWindow.maximize()
}

export const unmaximize = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await ElectronWindow.unmaximize()
}

export const close = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await ElectronWindow.close()
}

export const exit = async () => {
  await ElectronApp.exit()
}

export const setTitle = async (title) => {
  await RendererProcess.invoke(
    /* Window.setTitle */ 'Window.setTitle',
    /* title */ title
  )
}

export const openNew = async () => {
  if (Platform.platform === 'web' || Platform.platform === 'remote') {
    return
  }
  await ElectronWindow.openNew()
}
