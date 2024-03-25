import { app } from 'electron'

export const setLocale = (locale) => {
  app.commandLine.appendSwitch('lang', locale)
}
