import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const openContextMenu = (menuItems, x, y, customData) => {
  return ParentIpc.invoke('ElectronContextMenu.openContextMenu', menuItems, x, y, customData)
}
