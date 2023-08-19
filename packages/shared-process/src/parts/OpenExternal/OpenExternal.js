import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const showItemInFolder = (fullPath) => {
  return ParentIpc.invoke('ElectronShell.showItemInFolder', fullPath)
}

export const openExternal = (url) => {
  return ParentIpc.invoke('ElectronShell.openExternal', url)
}
