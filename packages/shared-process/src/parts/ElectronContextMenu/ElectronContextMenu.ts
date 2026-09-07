import * as Assert from '../Assert/Assert.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const openContextMenu = (menuItems: any, x: any, y: any, browserViewId?: number): any => {
  Assert.array(menuItems)
  Assert.number(x)
  Assert.number(y)
  return ParentIpc.invoke('ElectronContextMenu.openContextMenu', menuItems, x, y, browserViewId)
}

export const copyImage = (browserViewId: number, x: number, y: number): Promise<void> => {
  Assert.number(browserViewId)
  Assert.number(x)
  Assert.number(y)
  return ParentIpc.invoke('ElectronWebContents.callFunction', browserViewId, 'copyImageAt', x, y)
}
