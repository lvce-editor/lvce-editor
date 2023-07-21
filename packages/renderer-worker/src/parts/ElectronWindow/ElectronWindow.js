import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'

export const reload = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.reload', windowId)
}

export const minimize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.minimize', windowId)
}

export const unmaximize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.unmaximize', windowId)
}

export const maximize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.maximize', windowId)
}

export const close = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.close', windowId)
}

export const openNew = async (url) => {
  return ElectronProcess.invoke('AppElectronWindow.openNew', url)
}

export const toggleDevtools = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.toggleDevtools', windowId)
}

export const zoomIn = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronElectronWindow.zoomIn', windowId)
}

export const zoomOut = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronElectronWindow.zoomOut', windowId)
}

export const zoomReset = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronElectronWindow.zoomReset', windowId)
}

export const focus = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronElectronWindow.focus', windowId)
}
