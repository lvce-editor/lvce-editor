import * as MainProcess from '../MainProcess/MainProcess.ts'

export const showOpenDialog = (title: any, properties: any): any => {
  return MainProcess.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (options: any): any => {
  return MainProcess.invoke('ElectronDialog.showMessageBox', options)
}

export const showSaveDialog = (title: any, properties: any): any => {
  return MainProcess.invoke('ElectronDialog.showSaveDialog', title, properties)
}
