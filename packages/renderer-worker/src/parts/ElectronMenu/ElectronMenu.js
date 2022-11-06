import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const openContextMenu = (template, x, y) => {
  return ElectronProcess.invoke('ElectronMenu.openContextMenu', template, x, y)
}
