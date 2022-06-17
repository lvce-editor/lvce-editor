import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const reload = async () => {
  if (Platform.getPlatform() === 'web' || Platform.getPlatform() === 'remote') {
    await RendererProcess.invoke(/* windowReload */ 8080)
    return
  }
  if (Platform.getPlatform() === 'electron') {
    // TODO should use invoke here
    SharedProcess.send(/* Electron.windowReload */ 'Electron.windowReload')
  }
}

export const minimize = () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  SharedProcess.send(/* Electron.windowMinimize */ 'Electron.windowMinimize')
}

export const maximize = () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  SharedProcess.send(/* Electron.windowMaximize */ 'Electron.windowMaximize')
}

export const unmaximize = () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  SharedProcess.send(
    /* Electron.windowUnmaximize */ 'Electron.windowUnMaximize'
  )
}

export const close = () => {
  if (Platform.getPlatform() === 'web') {
    return
  }
  SharedProcess.send(/* Electron.windowClose */ 'Electron.windowClose')
}

export const exit = async () => {
  await SharedProcess.invoke(/* Electron.exit */ 'Electron.exit')
}

export const setTitle = async (title) => {
  await RendererProcess.invoke(/* Window.setTitle */ 8085, /* title */ title)
}

export const openNew = async () => {
  if (Platform.getPlatform() === 'web' || Platform.getPlatform() === 'remote') {
    return
  }
  await SharedProcess.invoke(
    /* Electron.windowOpenNew */ 'Electron.windowOpenNew'
  )
}
