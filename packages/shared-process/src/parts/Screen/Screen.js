import * as ParentIpc from '../MainProcess/MainProcess.js'

export const getWidth = () => {
  return ParentIpc.invoke('ElectronScreen.getWidth')
}

export const getHeight = () => {
  return ParentIpc.invoke('ElectronScreen.getHeight')
}

export const getBounds = () => {
  return ParentIpc.invoke('ElectronScreen.getBounds')
}
