import * as Chrome from '../Chrome/Chrome.js'

export const name = 'Window'

export const Commands = {
  close: Chrome.close,
  exit: Chrome.exit,
  maximize: Chrome.maximize,
  minimize: Chrome.minimize,
  openNew: Chrome.openNew,
  unmaximize: Chrome.unmaximize,
  zoomIn: Chrome.zoomIn,
  zoomOut: Chrome.zoomOut,
  zoomReset: Chrome.zoomReset,
}
