import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as AppWindow from '../AppWindow/AppWindow.js'

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

export const zoomIn = (windowId) => {
  return ParentIpc.invoke('ElectronWindow.zoomIn', windowId)
}

export const zoomOut = (windowId) => {
  return ParentIpc.invoke('ElectronWindow.zoomOut', windowId)
}

export const zoomReset = (windowId) => {
  return ParentIpc.invoke('ElectronWindow.zoomReset', windowId)
}

export const focus = (windowId) => {
  return ParentIpc.invoke('ElectronWindow.executeWebContentsFunction', windowId, 'focus')
}

export const handleClose = (windowId) => {
  // TODO
}
