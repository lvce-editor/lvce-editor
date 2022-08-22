import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

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
  await SharedProcess.invoke(
    /* Electron.windowMinimize */ 'Electron.windowMinimize'
  )
}

export const maximize = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await SharedProcess.invoke(
    /* Electron.windowMaximize */ 'Electron.windowMaximize'
  )
}

export const unmaximize = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await SharedProcess.invoke(
    /* Electron.windowUnmaximize */ 'Electron.windowUnMaximize'
  )
}

export const close = async () => {
  if (Platform.platform === 'web') {
    return
  }
  await SharedProcess.invoke(/* Electron.windowClose */ 'Electron.windowClose')
}

export const exit = async () => {
  await SharedProcess.invoke(/* Electron.exit */ 'Electron.exit')
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
  await SharedProcess.invoke(
    /* Electron.windowOpenNew */ 'Electron.windowOpenNew'
  )
}
