import * as Command from '../Command/Command.js'

export const importFirefoxCookies = async (state) => {
  await Command.execute('Main.openUri', 'cookie-import-view:///')
  return state
}
