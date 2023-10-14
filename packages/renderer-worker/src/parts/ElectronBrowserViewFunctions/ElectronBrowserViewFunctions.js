import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const resizeBrowserView = (id, x, y, width, height) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = async (id, iframeSrc) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.focus', id)
}

export const openDevtools = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.openDevtools', id)
}

export const reload = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.reload', id)
}

export const forward = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.forward', id)
}

export const backward = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.backward', id)
}

export const cancelNavigation = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.cancelNavigation', id)
}

export const show = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.show', id)
}

export const hide = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.hide', id)
}

export const inspectElement = (id, x, y) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.setFallthroughKeyBindings', fallthroughKeyBindings)
}

export const getStats = (id) => {
  return SharedProcess.invoke('ElectronBrowserViewFunctions.getStats', id)
}
