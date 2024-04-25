import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const createWebContentsView = async (restoreId, fallThroughKeyBindings) => {
  const id = await EmbedsProcess.invoke('ElectronWebContentsView.createWebContentsView', restoreId, fallThroughKeyBindings)
  return id
}

export const disposeWebContentsView = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.disposeWebContentsView', id)
}

export const resizeWebContentsView = (id, x, y, width, height) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = (id, iframeSrc) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.focus', id)
}

export const openDevtools = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.openDevtools', id)
}

export const reload = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.reload', id)
}

export const show = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.show', id)
}

export const hide = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.hide', id)
}

export const forward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.forward', id)
}

export const backward = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.backward', id)
}

export const cancelNavigation = (id) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.cancelNavigation', id)
}

export const inspectElement = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (id, fallthroughKeybindings) => {
  // TODO
  // return EmbedsProcess.invoke('ElectronWebContentsView.setFallthroughKeyBindings', id, fallthroughKeybindings)
}

export const getStats = (id, fallthroughKeybindings) => {
  return EmbedsProcess.invoke('ElectronWebContentsView.getStats', id, fallthroughKeybindings)
}

const forwardEvent =
  (key) =>
  (id, ...args) => {
    Rpc.send(key, ...args)
  }

export const handleDidNavigate = forwardEvent('ElectronBrowserView.handleDidNavigate')

export const handleTitleUpdated = forwardEvent('ElectronBrowserView.handleTitleUpdated')

export const handleWillNavigate = forwardEvent('ElectronBrowserView.handleWillNavigate')

export const handleContextMenu = forwardEvent('ElectronBrowserView.handleContextMenu')
