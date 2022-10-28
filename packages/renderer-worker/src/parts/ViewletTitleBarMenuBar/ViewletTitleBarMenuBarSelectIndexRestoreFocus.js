import * as Command from '../Command/Command.js'

export const selectIndexRestoreFocus = async (state, item) => {
  const args = item.args || []
  await Command.execute(item.command, ...args)
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
  }
}
