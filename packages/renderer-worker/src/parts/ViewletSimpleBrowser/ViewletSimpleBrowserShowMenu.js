import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const showMenu = async (state, x, buttonTop, buttonHeight) => {
  const y = state.y + buttonTop + buttonHeight
  await ContextMenu.show2Below(state.uid, MenuEntryId.SimpleBrowserToolbar, x, y)
  return state
}
