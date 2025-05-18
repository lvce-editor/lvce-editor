import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'

export const openContextMenu = (menuItems, x, y) => {
  Assert.array(menuItems)
  Assert.number(x)
  Assert.number(y)
  return ParentIpc.invoke('ElectronContextMenu.openContextMenu', menuItems, x, y)
}
