import * as ParentIpc from '../MainProcess/MainProcess.js'

export const showOpenDialog = (title, properties) => {
  return ParentIpc.invoke('ElectronDialog.showOpenDialog', title, properties)
}

export const showMessageBox = (options) => {
  return ParentIpc.invoke('ElectronDialog.showMessageBox', options)
}
