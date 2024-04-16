import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'

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

export const resizeWebContentsView = async (id, x, y, width, height) => {
  // TODO speed up resizing by avoid too many round trips
  const windowId = await GetWindowId.getWindowId()
  const zoomLevel = await SharedProcess.invoke('ElectronWindow.getZoom', windowId)
  const zoomValue = getZoomLevelToPercentValue(zoomLevel)
  const modifiedWidth = Math.round(width * zoomValue)
  const modifiedHeight = Math.round(height * zoomValue)
  return EmbedsWorker.invoke('ElectronWebContentsView.resizeWebContentsView', id, x, y, modifiedWidth, modifiedHeight)
}

export const setIframeSrc = async (id, iframeSrc) => {
  return EmbedsWorker.invoke('ElectronWebContentsView.setIframeSrc', id, iframeSrc)
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

export const forward = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.forward', id)
}

export const backward = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.backward', id)
}

export const cancelNavigation = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.cancelNavigation', id)
}

export const show = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.show', id)
}

export const hide = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.hide', id)
}

export const inspectElement = (id, x, y) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.inspectElement', id, x, y)
}

export const copyImageAt = (id, x, y) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.copyImageAt', id, x, y)
}

export const setFallthroughKeyBindings = (fallthroughKeyBindings) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.setFallthroughKeyBindings', fallthroughKeyBindings)
}

export const getStats = (id) => {
  return SharedProcess.invoke('ElectronWebContentsViewFunctions.getStats', id)
}
