import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

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
