import * as MainProcess from '../MainProcess/MainProcess.js'

export const showOpenDialog = (title, properties) => {
  return MainProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (options) => {
  return MainProcess.invoke('ElectronDialog.showMessageBox', options)
}
