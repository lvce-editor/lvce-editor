import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const reload = async () => {
  if (Platform.getPlatform() === 'web' || Platform.getPlatform() === 'remote') {
    await RendererProcess.invoke(/* windowReload */ 8080)
    return
  }
  if (Platform.getPlatform() === 'electron') {
    await ElectronWindow.reload()
  }
}

export const minimize = async () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  await ElectronWindow.minimize()
}

export const maximize = async () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  await ElectronWindow.maximize()
}

export const unmaximize = async () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  await ElectronWindow.unmaximize()
}

export const close = async () => {
  if (Platform.getPlatform() === 'web') {
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
  if (Platform.getPlatform() === 'web' || Platform.getPlatform() === 'remote') {
    return
  }
  await ElectronWindow.openNew()
}
