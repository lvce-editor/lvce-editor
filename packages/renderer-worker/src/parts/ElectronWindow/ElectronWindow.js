import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const reload = () => {
  return ElectronProcess.invoke('ElectronWindow.reload')
}

export const minimize = () => {
  return ElectronProcess.invoke('ElectronWindow.minimize')
}

export const unmaximize = () => {
  return ElectronProcess.invoke('ElectronWindow.unmaximize')
}

export const maximize = () => {
  return ElectronProcess.invoke('ElectronWindow.maximize')
}

export const close = () => {
  return ElectronProcess.invoke('ElectronWindow.close')
}

export const openNew = (url) => {
  return ElectronProcess.invoke('AppWindow.openNew', url)
}

export const toggleDevtools = () => {
  return ElectronProcess.invoke('ElectronWindow.toggleDevtools')
}

export const zoomIn = () => {
  return ElectronProcess.invoke('ElectronWindow.zoomIn')
}

export const zoomOut = () => {
  return ElectronProcess.invoke('ElectronWindow.zoomOut')
}
