import * as Command from '../Command/Command.js'

export const setIconTheme = async (id) => {
  await Command.execute('IconTheme.setIconTheme', id)
}
