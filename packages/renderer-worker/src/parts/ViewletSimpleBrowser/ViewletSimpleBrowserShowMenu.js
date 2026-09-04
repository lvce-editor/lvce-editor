import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const showMenu = async (state, x, toolbarTop, buttonTop, buttonHeight) => {
  const y = state.y + toolbarTop + buttonTop + buttonHeight
  await ContextMenu.show2Below(state.uid, MenuEntryId.SimpleBrowserToolbar, x, y)
  return state
}
