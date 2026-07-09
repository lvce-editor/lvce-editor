import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getWidth = (): any => {
  return ParentIpc.invoke('ElectronScreen.getWidth')
}

export const getHeight = (): any => {
  return ParentIpc.invoke('ElectronScreen.getHeight')
}

export const getBounds = (): any => {
  return ParentIpc.invoke('ElectronScreen.getBounds')
}
