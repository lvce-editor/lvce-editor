import * as Window from './Window.ts'

export const name = 'Window'

export const Commands = {
  close: Window.close,
  maximize: Window.maximize,
  minimize: Window.minimize,
  onVisibilityChange: Window.onVisibilityChange,
  reload: Window.reload,
  unmaximize: Window.unmaximize,
}
