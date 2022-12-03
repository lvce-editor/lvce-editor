import * as ElectronContextMenu from '../ElectronContextMenu/ElectronContextMenu.js'

export const show = (x, y, id, ...args) => {
  return ElectronContextMenu.openContextMenu(x, y, id, ...args)
}
