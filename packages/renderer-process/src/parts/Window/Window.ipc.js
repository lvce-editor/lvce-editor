import * as Command from '../Command/Command.js'
import * as Window from './Window.js'

export const __initialize__ = () => {
  Command.register('Window.reload', Window.reload)
  Command.register('Window.minimize', Window.minimize)
  Command.register('Window.maximize', Window.maximize)
  Command.register('Window.unmaximize', Window.unmaximize)
  Command.register('Window.close', Window.close)
  Command.register('Window.setTitle', Window.setTitle)
  Command.register('Window.onVisibilityChange', Window.onVisibilityChange)
}
