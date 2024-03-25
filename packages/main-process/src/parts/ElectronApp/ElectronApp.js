import { app } from 'electron'

export const quit = () => {
  app.quit()
}

export const on = (event, listener) => {
  app.on(event, listener)
}

export const whenReady = () => {
  return app.whenReady()
}

export const enableSandbox = () => {
  app.enableSandbox()
}

export const appendCommandLineSwitch = (commandLineSwitch, value) => {
  app.commandLine.appendSwitch(commandLineSwitch, value)
}

export const exit = (code) => {
  app.exit(code)
}
