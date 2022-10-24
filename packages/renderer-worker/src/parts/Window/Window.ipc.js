import * as Window from './Window.js'
import * as Chrome from '../Chrome/Chrome.js'

export const Commands = {
  'Window.close': Chrome.close,
  'Window.exit': Chrome.exit,
  'Window.maximize': Chrome.maximize,
  'Window.minimize': Chrome.minimize,
  'Window.openNew': Chrome.openNew,
  'Window.reload': Window.reload,
  'Window.unmaximize': Chrome.unmaximize,
  'Window.zoomIn': Chrome.zoomIn,
  'Window.zoomOut': Chrome.zoomOut,
}
