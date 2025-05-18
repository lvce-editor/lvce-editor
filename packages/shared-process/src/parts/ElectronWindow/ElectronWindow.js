import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Assert from '../Assert/Assert.js'
import * as Clamp from '../Clamp/Clamp.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

export const openNew = () => {
  return AppWindow.openNew()
}

export const minimize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'minimize')
}

export const toggleDevtools = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'toggleDevTools')
}

export const maximize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'maximize')
}

export const unmaximize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'unmaximize')
}

export const close = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'close')
}

export const reload = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'reload')
}

const setZoom = async (windowId, zoomFactor, minZoomLevel, maxZoomLevel) => {
  const newZoomFactor = Clamp.clamp(zoomFactor, minZoomLevel, maxZoomLevel)
  await ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'setZoomLevel', newZoomFactor)
  // TODO
  // await Preferences.update('window.zoomLevel', newZoomFactor)
}

/**
 *
 * @param {number} windowId
 * @param {*} getDelta
 * @param {*} getMinZoomLevel
 * @param {*} getMaxZoomLevel
 * @returns
 */
const setZoomDelta = async (windowId, getDelta, getMinZoomLevel, getMaxZoomLevel) => {
  const delta = getDelta()
  const minZoomLevel = getMinZoomLevel()
  const maxZoomLevel = getMaxZoomLevel()
  const currentZoomLevel = await ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'getZoomLevel')
  return setZoom(windowId, currentZoomLevel + delta, minZoomLevel, maxZoomLevel)
}

const getMinZoomLevel = () => {
  return -3
}

const getMaxZoomLevel = () => {
  return 3
}

const getZoomInDelta = () => {
  return 0.2
}

const getZoomOutDelta = () => {
  return -0.2
}

const getDefaultZoomLevel = () => {
  return 0
}

export const zoomIn = (windowId) => {
  return setZoomDelta(windowId, getZoomInDelta, getMinZoomLevel, getMaxZoomLevel)
}

export const zoomOut = (windowId) => {
  return setZoomDelta(windowId, getZoomOutDelta, getMinZoomLevel, getMaxZoomLevel)
}

export const zoomReset = (windowId) => {
  return setZoom(windowId, getDefaultZoomLevel(), getMinZoomLevel(), getMaxZoomLevel())
}

export const getZoom = (windowId) => {
  // TODO zoom level should be stored in shared process
  return ParentIpc.invoke('ElectronWindow.getZoom', windowId)
}

export const focus = (windowId) => {
  return ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'focus')
}

export const handleClose = (windowId) => {
  // TODO
}

export const getFocusedWindowId = () => {
  return ParentIpc.invoke('ElectronWindow.getFocusedWindowId')
}
