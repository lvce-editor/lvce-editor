import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

export const show = (x, y, id, ...args) => {
  return ElectronMenu.openContextMenu(x, y, id, ...args)
}
