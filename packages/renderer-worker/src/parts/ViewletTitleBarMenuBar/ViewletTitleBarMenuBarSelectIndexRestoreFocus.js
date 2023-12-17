import * as ExecuteMenuItemCommand from '../ExecuteMenuItemCommand/ExecuteMenuItemCommand.js'

export const selectIndexRestoreFocus = async (state, item) => {
  ExecuteMenuItemCommand.executeMenuItemCommand(item)
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
  }
}
