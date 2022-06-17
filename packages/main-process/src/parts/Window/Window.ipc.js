const Command = require('../Command/Command.js')
const Window = require('./Window.js')

exports.__initialize__ = () => {
  Command.register(6521, Window.wrapWindowCommand(Window.minimize))
  Command.register(6522, Window.wrapWindowCommand(Window.maximize))
  Command.register(6523, Window.wrapWindowCommand(Window.toggleDevtools))
  Command.register(6524, Window.wrapWindowCommand(Window.unmaximize))
  Command.register(6525, Window.wrapWindowCommand(Window.close))
  Command.register(6526, Window.wrapWindowCommand(Window.reload))
}
