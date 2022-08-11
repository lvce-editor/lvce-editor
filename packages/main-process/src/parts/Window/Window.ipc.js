const Command = require('../Command/Command.js')
const Window = require('./Window.js')

// prettier-ignore
exports.__initialize__ = () => {
  Command.register('Window.minimize', Window.wrapWindowCommand(Window.minimize))
  Command.register('Window.maximize', Window.wrapWindowCommand(Window.maximize))
  Command.register('Window.toggleDevtools', Window.wrapWindowCommand(Window.toggleDevtools))
  Command.register('Window.unmaximize', Window.wrapWindowCommand(Window.unmaximize))
  Command.register('Window.close', Window.wrapWindowCommand(Window.close))
  Command.register('Window.reload', Window.wrapWindowCommand(Window.reload))
}
