import * as SharedProcess from '../SharedProcess/SharedProcess.js'
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
  const zoomLevel = await SharedProcess.invoke('ElectronWindow.getZoom', windowId)
  const zoomValue = getZoomLevelToPercentValue(zoomLevel)
  const modifiedWidth = Math.round(width * zoomValue)
  const modifiedHeight = Math.round(height * zoomValue)
  return SharedProcess.invoke('ElectronBrowserViewFunctions.resizeBrowserView', id, x, y, modifiedWidth, modifiedHeight)
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
