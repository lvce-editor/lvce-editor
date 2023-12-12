import { BrowserWindow, Menu } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as GetElectronMenuItems from '../GetElectronMenuItems/GetElectronMenuItems.js'
import * as Promises from '../Promises/Promises.js'

const getCallbacks = () => {
  const { resolve, promise } = Promises.withResolvers()
  const handleClick = (menuItem) => {
    resolve({
      type: 'click',
      data: menuItem,
    })
  }
  const handleClose = () => {
    resolve({
      type: 'close',
      data: undefined,
    })
  }
  return {
    handleClick,
    handleClose,
    promise,
  }
}

export const openContextMenu = async (menuItems, x, y) => {
  Assert.array(menuItems)
  Assert.number(x)
  Assert.number(y)
  const { promise, handleClick, handleClose } = getCallbacks()
  const template = GetElectronMenuItems.getElectronMenuItems(menuItems, handleClick)
  const menu = Menu.buildFromTemplate(template)
  const window = BrowserWindow.getFocusedWindow()
  if (!window) {
    return {
      type: 'close',
      data: undefined,
    }
  }
  menu.popup({ window, x, y, callback: handleClose })
  const event = await promise
  if (event.type === 'click') {
    return {
      type: 'click',
      data: event.data.label,
    }
  }
  if (event.type === 'close') {
    return {
      type: 'close',
      data: undefined,
    }
  }
}
