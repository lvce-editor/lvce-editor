import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const showOpenDialog = (title, properties) => {
  return ElectronProcess.invoke(
    'ElectronDialog.showOpenDialog',
    title,
    properties
  )
}

export const showMessageBox = (message, buttons) => {
  return ElectronProcess.invoke(
    'ElectronDialog.showMessageBox',
    message,
    buttons
  )
}
