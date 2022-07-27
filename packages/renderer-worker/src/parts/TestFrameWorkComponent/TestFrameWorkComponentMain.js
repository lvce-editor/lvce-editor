import * as Command from '../Command/Command.js'

export const openUri = async (uri) => {
  await Command.execute('Main.openUri', uri)
}
