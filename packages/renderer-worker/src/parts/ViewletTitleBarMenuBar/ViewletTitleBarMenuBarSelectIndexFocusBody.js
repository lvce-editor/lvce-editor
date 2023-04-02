import * as ExecuteMenuItemCommand from '../ExecuteMenuItemCommand/ExecuteMenuItemCommand.js'

export const selectIndexFocusBody = async (state, item) => {
  // TODO handle error
  void ExecuteMenuItemCommand.executeMenuItemCommand(item)
  return {
    ...state,
    menus: [],
    isMenuOpen: false,
    focusedIndex: -1,
  }
}
