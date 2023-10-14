import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

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
  return SharedProcess.invoke('ElectronWindow.openNew', url)
}

export const toggleDevtools = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.toggleDevtools', windowId)
}

export const zoomIn = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.zoomIn', windowId)
}

export const zoomOut = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.zoomOut', windowId)
}

export const zoomReset = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.zoomReset', windowId)
}

export const focus = async () => {
  const windowId = await GetWindowId.getWindowId()
  return SharedProcess.invoke('ElectronWindow.focus', windowId)
}
