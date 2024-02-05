import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ElectronWebContents from '../ElectronWebContents/ElectronWebContents.js'

export const resizeBrowserView = (id, x, y, width, height) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.resizeBrowserView', id, x, y, width, height)
}

export const setIframeSrc = async (id, iframeSrc) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.setIframeSrc', id, iframeSrc)
}

const callFunction = (id, functionName) => {
  return ParentIpc.invoke('ElectronWebContents.callFunction', id, functionName)
}

export const focus = ElectronWebContents.focus

export const openDevtools = ElectronWebContents.openDevtools

export const reload = ElectronWebContents.reload

export const forward = ElectronWebContents.forward

export const backward = ElectronWebContents.backward

export const cancelNavigation = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.cancelNavigation', id)
}

export const show = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.show', id)
}

export const hide = (id) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.hide', id)
}

export const inspectElement = ElectronWebContents.inspectElement

export const copyImageAt = (id, x, y) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return ParentIpc.invoke('ElectronBrowserViewFunctions.setFallthroughKeyBindings', fallthroughKeyBindings)
}

export const getStats = (id) => {
  return ParentIpc.invoke('ElectronWebContents.getStats', id)
}
