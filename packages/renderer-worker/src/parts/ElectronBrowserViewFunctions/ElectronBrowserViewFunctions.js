import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const resizeBrowserView = (id, left, top, width, height) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.resizeBrowserView',
    id,
    left,
    top,
    width,
    height
  )
}

export const setIframeSrc = (id, iframeSrc) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.setIframeSrc',
    id,
    iframeSrc
  )
}

export const focus = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.focus', id)
}

export const openDevtools = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.openDevtools', id)
}

export const reload = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.reload', id)
}

export const forward = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.forward', id)
}

export const backward = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.backward', id)
}
