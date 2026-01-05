import * as ElectronContextMenu from '../ElectronContextMenu/ElectronContextMenu.js'

export const show = (x, y, id, ...args) => {
  return ElectronContextMenu.openContextMenu(x, y, id, ...args)
}

export const show2 = (uid, menuId, x, y, ...args) => {
  return ElectronContextMenu.openContextMenu2(x, y, uid, menuId, ...args)
}
