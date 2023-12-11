import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as AppWindow from '../AppWindow/AppWindow.js'

export const openNew = () => {
  return AppWindow.openNew()
}

export const minimize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.minimize', windowId)
}

export const toggleDevtools = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.toggleDevtools', windowId)
}

export const maximize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.maximize', windowId)
}

export const unmaximize = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.unmaximize')
}

export const close = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.close', windowId)
}

export const reload = (windowId) => {
  Assert.number(windowId)
  return ParentIpc.invoke('ElectronWindow.reload', windowId)
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
  return ParentIpc.invoke('ElectronWindow.focus', windowId)
}

export const handleClose = (windowId) => {
  // TODO
}
