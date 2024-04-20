import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await EmbedsProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}

export const resizeWebContentsView = (id, x, y, width, height) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = (id, iframeSrc) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.focus', id)
}

export const openDevtools = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.openDevtools', id)
}

export const reload = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.reload', id)
}

export const show = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.show', id)
}

export const hide = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.hide', id)
}

export const forward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.forward', id)
}

export const backward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.backward', id)
}

export const cancelNavigation = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.cancelNavigation', id)
}

export const inspectElement = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (id, fallthroughKeybindings) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.setFallthroughKeyBindings', id, fallthroughKeybindings)
}

export const getStats = (id, fallthroughKeybindings) => {
  return EmbedsProcess.invoke('ElectronWebContentsViewFunctions.getStats', id, fallthroughKeybindings)
}
