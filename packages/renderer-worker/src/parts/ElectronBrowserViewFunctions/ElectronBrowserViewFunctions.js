// deprecated, use webcontentsview instead
import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'

// TODO improve and test function
const getZoomLevelToPercentValue = (zoomLevel) => {
  if (zoomLevel === 0) {
    return 1
  }
  if (zoomLevel === -0.2) {
    return 0.96
  }
  if (zoomLevel === 0.2) {
    return 1.04
  }
  return 1
}

export const resizeBrowserView = async (id, x, y, width, height) => {
  // TODO speed up resizing by avoid too many round trips
  const windowId = await GetWindowId.getWindowId()
  const zoomLevel = await EmbedsWorker.invoke('ElectronWindow.getZoom', windowId)
  const zoomValue = getZoomLevelToPercentValue(zoomLevel)
  const modifiedWidth = Math.round(width * zoomValue)
  const modifiedHeight = Math.round(height * zoomValue)
  return EmbedsWorker.invoke('ElectronWebContentsView.resizeBrowserView', id, x, y, modifiedWidth, modifiedHeight)
}

export const setIframeSrc = async (id, iframeSrc) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.setIframeSrc', id, iframeSrc)
}

export const focus = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.focus', id)
}

export const openDevtools = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.openDevtools', id)
}

export const reload = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.reload', id)
}

export const forward = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.forward', id)
}

export const backward = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.backward', id)
}

export const cancelNavigation = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.cancelNavigation', id)
}

export const show = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.show', id)
}

export const hide = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.hide', id)
}

export const inspectElement = (id, x, y) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.setFallthroughKeyBindings', fallthroughKeyBindings)
}

export const getStats = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.getStats', id)
}
export const getDomTree = (id) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.getDomTree', id)
}
