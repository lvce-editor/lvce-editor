import * as Chrome from '../Chrome/Chrome.js'
import * as Window from './Window.js'

export const name = 'Window'

export const Commands = {
  close: Chrome.close,
  exit: Chrome.exit,
  maximize: Chrome.maximize,
  minimize: Chrome.minimize,
  openNew: Chrome.openNew,
  reload: Window.reload,
  unmaximize: Chrome.unmaximize,
  zoomIn: Chrome.zoomIn,
  zoomOut: Chrome.zoomOut,
}
