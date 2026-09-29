import * as Chrome from '../Chrome/Chrome.js'
import * as ToggleFullScreen from '../ToggleFullScreen/ToggleFullScreen.js'

export const name = 'Window'

export const Commands = {
  close: Chrome.close,
  exit: Chrome.exit,
  maximize: Chrome.maximize,
  minimize: Chrome.minimize,
  openNew: Chrome.openNew,
  toggleFullScreen: ToggleFullScreen.toggleFullScreen,
  unmaximize: Chrome.unmaximize,
  zoomIn: Chrome.zoomIn,
  zoomOut: Chrome.zoomOut,
  zoomReset: Chrome.zoomReset,
}
