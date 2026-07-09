import * as AppWindow from '../AppWindow/AppWindow.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const openNew = (_windowId: any, url: any): any => {
  return AppWindow.openNew(url)
}

export const openNewWithUri = (_windowId: any, uri: any): any => {
  Assert.string(uri)
  return AppWindow.openNewWithUri(uri)
}

export const minimize = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'minimize')
}

export const toggleDevtools = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'toggleDevtools')
}

export const maximize = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'maximize')
}

export const unmaximize = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'unmaximize')
}

export const close = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'close')
}

export const reload = (windowId: any): any => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.executeWindowFunction', windowId, 'reload')
}

const setZoom = async (windowId: any, zoomFactor: any, minZoomLevel: any, maxZoomLevel: any): Promise<any> => {
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
const setZoomDelta = async (windowId: any, getDelta: any, getMinZoomLevel: any, getMaxZoomLevel: any): Promise<any> => {
  const delta = getDelta()
  const minZoomLevel = getMinZoomLevel()
  const maxZoomLevel = getMaxZoomLevel()
  const currentZoomLevel = await ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'getZoomLevel')
  return setZoom(windowId, currentZoomLevel + delta, minZoomLevel, maxZoomLevel)
}

const getMinZoomLevel = (): any => {
  return -3
}

const getMaxZoomLevel = (): any => {
  return 3
}

const getZoomInDelta = (): any => {
  return 0.2
}

const getZoomOutDelta = (): any => {
  return -0.2
}

const getDefaultZoomLevel = (): any => {
  return 0
}

export const zoomIn = (windowId: any): any => {
  return setZoomDelta(windowId, getZoomInDelta, getMinZoomLevel, getMaxZoomLevel)
}

export const zoomOut = (windowId: any): any => {
  return setZoomDelta(windowId, getZoomOutDelta, getMinZoomLevel, getMaxZoomLevel)
}

export const zoomReset = (windowId: any): any => {
  return setZoom(windowId, getDefaultZoomLevel(), getMinZoomLevel(), getMaxZoomLevel())
}

export const getZoom = (windowId: any): any => {
  // TODO zoom level should be stored in shared process
  return ParentIpc.invoke('ElectronWindow.getZoom', windowId)
}

export const focus = (windowId: any): any => {
  return ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'focus')
}

export const handleClose = (windowId: any): any => {
  // TODO
}

export const getFocusedWindowId = (): any => {
  return ParentIpc.invoke('ElectronWindow.getFocusedWindowId')
}
