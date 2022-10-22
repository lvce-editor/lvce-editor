import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import { VError } from '../VError/VError.js'

export const resizeBrowserView = (left, top, width, height) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.resizeBrowserView',
    left,
    top,
    width,
    height
  )
}

export const setIframeSrc = (iframeSrc) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.setIframeSrc',
    iframeSrc
  )
}

export const openDevtools = () => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.openDevtools')
}

export const reload = () => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.reload')
}

export const forward = () => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.forward')
}

export const backward = () => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.backward')
}
