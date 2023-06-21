const { app } = require('electron')

exports.quit = () => {
  app.quit()
}

exports.requestSingleInstanceLock = (argv) => {
  return app.requestSingleInstanceLock(argv)
}

exports.on = (event, listener) => {
  app.on(event, listener)
}

exports.whenReady = () => {
  return app.whenReady()
}

exports.enableSandbox = () => {
  app.enableSandbox()
}

exports.appendCommandLineSwitch = (commandLineSwitch, value) => {
  app.commandLine.appendSwitch(commandLineSwitch, value)
}

exports.exit = (code) => {
  app.exit(code)
}

exports.setLocale = (locale) => {
  app.commandLine.appendSwitch('lang', locale)
}
