import * as Window from './Window.js'

export const name = 'Window'

export const Commands = {
  close: Window.close,
  maximize: Window.maximize,
  minimize: Window.minimize,
  onVisibilityChange: Window.onVisibilityChange,
  reload: Window.reload,
  setTitle: Window.setTitle,
  unmaximize: Window.unmaximize,
}
