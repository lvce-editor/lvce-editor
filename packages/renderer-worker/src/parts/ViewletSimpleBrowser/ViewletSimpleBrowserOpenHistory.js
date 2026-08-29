import * as Command from '../Command/Command.js'

export const openHistory = async (state) => {
  await Command.execute('Main.openUri', 'simple-browser-history://')
  return state
}
