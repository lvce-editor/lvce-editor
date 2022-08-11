const Window = require('./Window.js')

// prettier-ignore
exports.Commands = {
  'Window.minimize': Window.wrapWindowCommand(Window.minimize),
  'Window.maximize': Window.wrapWindowCommand(Window.maximize),
  'Window.toggleDevtools': Window.wrapWindowCommand(Window.toggleDevtools),
  'Window.unmaximize': Window.wrapWindowCommand(Window.unmaximize),
  'Window.close': Window.wrapWindowCommand(Window.close),
  'Window.reload': Window.wrapWindowCommand(Window.reload),
}
