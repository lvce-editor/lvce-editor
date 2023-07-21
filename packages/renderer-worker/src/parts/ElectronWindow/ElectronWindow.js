import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'

export const reload = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.reload', windowId)
}

export const minimize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.minimize', windowId)
}

export const unmaximize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.unmaximize', windowId)
}

export const maximize = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.maximize', windowId)
}

export const close = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.close', windowId)
}

export const openNew = async (url) => {
  return ElectronProcess.invoke('AppWindow.openNew', url)
}

export const toggleDevtools = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('Window.toggleDevtools', windowId)
}

export const zoomIn = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronWindow.zoomIn', windowId)
}

export const zoomOut = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronWindow.zoomOut', windowId)
}

export const zoomReset = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronWindow.zoomReset', windowId)
}

export const focus = async () => {
  const windowId = await GetWindowId.getWindowId()
  return ElectronProcess.invoke('ElectronWindow.focus', windowId)
}
