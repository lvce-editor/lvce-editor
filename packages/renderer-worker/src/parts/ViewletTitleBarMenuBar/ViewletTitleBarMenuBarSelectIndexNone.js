import * as ExecuteMenuItemcommand from '../ExecuteMenuItemCommand/ExecuteMenuItemCommand.js'

export const selectIndexNone = async (state, item) => {
  await ExecuteMenuItemcommand.executeMenuItemCommand(item)
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
  }
}
