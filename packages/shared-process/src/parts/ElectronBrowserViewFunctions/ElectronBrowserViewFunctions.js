import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const resizeBrowserView = (id, x, y, width, height) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = async (id, iframeSrc) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.focus', id)
}

export const openDevtools = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.openDevtools', id)
}

export const reload = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.reload', id)
}

export const forward = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.forward', id)
}

export const backward = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.backward', id)
}

export const cancelNavigation = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.cancelNavigation', id)
}

export const show = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.show', id)
}

export const hide = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.hide', id)
}

export const inspectElement = (id, x, y) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.setFallthroughKeyBindings', fallthroughKeyBindings)
}

export const getStats = (id) => {
  return ParentIpc.invoke('ElectronWebContents.getStats', id)
}
