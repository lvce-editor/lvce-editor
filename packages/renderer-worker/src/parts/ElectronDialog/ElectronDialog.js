import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as Assert from '../Assert/Assert.js'

export const showOpenDialog = (title, properties) => {
  return ElectronProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (message, buttons, type) => {
  Assert.string(message)
  Assert.array(buttons)
  return ElectronProcess.invoke('ElectronDialog.showMessageBox', message, buttons, type)
}
