import * as SharedProcess from '../SharedProcess/SharedProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await SharedProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return SharedProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}

export const resizeWebContentsView = (id, x, y, width, height) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = (id, iframeSrc) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.focus', id)
}

export const openDevtools = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.openDevtools', id)
}

export const reload = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.reload', id)
}

export const show = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.reload', id)
}

export const hide = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.reload', id)
}

export const forward = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.forward', id)
}

export const backward = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.backward', id)
}

export const cancelNavigation = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.cancelNavigation', id)
}

export const inspectElement = (id, x, y) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (id, fallthroughKeybindings) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.setFallthroughKeyBindings', id, fallthroughKeybindings)
}

export const getStats = (id, fallthroughKeybindings) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.getStats', id, fallthroughKeybindings)
}
