import * as Window from './Window.js'

export const name = 'Window'

export const Commands = {
  minimize: Window.minimize,
  maximize: Window.maximize,
  toggleDevtools: Window.toggleDevtools,
  unmaximize: Window.unmaximize,
  close: Window.close,
  reload: Window.reload,
}
