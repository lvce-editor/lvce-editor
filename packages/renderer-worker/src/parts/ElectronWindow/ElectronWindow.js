import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const reload = async () => {
  return ElectronProcess.invoke('ElectronWindow.reload')
}

export const minimize = async () => {
  return ElectronProcess.invoke('ElectronWindow.minimize')
}

export const unmaximize = async () => {
  return ElectronProcess.invoke('ElectronWindow.unmaximize')
}

export const maximize = async () => {
  return ElectronProcess.invoke('ElectronWindow.maximize')
}

export const close = async () => {
  return ElectronProcess.invoke('ElectronWindow.close')
}

export const openNew = async () => {
  return ElectronProcess.invoke('ElectronWindow.openNew')
}

export const toggleDevtools = async () => {
  return ElectronProcess.invoke('ElectronWindow.toggleDevtools')
}
