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

export const setIframeSrc = async (id, iframeSrc) => {
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

export const cancelNavigation = (id) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.cancelNavigation',
    id
  )
}

export const show = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.show', id)
}

export const hide = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.hide', id)
}

export const inspectElement = (id, x, y) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.inspectElement',
    id,
    x,
    y
  )
}

export const copyImageAt = (id, x, y) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.copyImageAt',
    id,
    x,
    y
  )
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return ElectronProcess.invoke(
    'ElectronBrowserViewFunctions.setFallthroughKeyBindings',
    fallthroughKeyBindings
  )
}

export const getStats = (id) => {
  return ElectronProcess.invoke('ElectronBrowserViewFunctions.getStats', id)
}
