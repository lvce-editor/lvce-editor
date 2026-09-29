import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const showItemInFolder = (fullPath: any): any => {
  return ParentIpc.invoke('ElectronShell.showItemInFolder', fullPath)
}

export const openExternal = (url: any): any => {
  return ParentIpc.invoke('ElectronShell.openExternal', url)
}
