import * as ExecuteMenuItemcommand from '../ExecuteMenuItemCommand/ExecuteMenuItemCommand.js'

export const selectIndexIgnore = async (state, item) => {
  await ExecuteMenuItemcommand.executeMenuItemCommand(item)
  return state
}
