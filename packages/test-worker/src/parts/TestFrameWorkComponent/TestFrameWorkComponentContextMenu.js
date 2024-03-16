import * as Command from '../Command/Command.js'

export const selectItem = async (text) => {
  await Command.execute('Menu.selectItem', text)
}
