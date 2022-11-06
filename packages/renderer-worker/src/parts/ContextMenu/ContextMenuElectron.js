import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

export const show = (x, y, id) => {
  return ElectronMenu.openContextMenu(x, y, id)
}
