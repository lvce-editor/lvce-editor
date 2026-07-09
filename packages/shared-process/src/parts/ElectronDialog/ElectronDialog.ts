import * as MainProcess from '../MainProcess/MainProcess.ts'

export const showOpenDialog = (title, properties) => {
  return MainProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (options) => {
  return MainProcess.invoke('ElectronDialog.showMessageBox', options)
}

export const showSaveDialog = (title, properties) => {
  return MainProcess.invoke('ElectronDialog.showSaveDialog', title, properties)
}
