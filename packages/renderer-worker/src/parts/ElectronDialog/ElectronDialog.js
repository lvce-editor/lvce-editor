import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as Assert from '../Assert/Assert.js'

export const showOpenDialog = (title, properties) => {
  return ElectronProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (options) => {
  // TODO maybe request window id here instead of at caller
  Assert.object(options)
  return ElectronProcess.invoke('ElectronDialog.showMessageBox', options)
}
