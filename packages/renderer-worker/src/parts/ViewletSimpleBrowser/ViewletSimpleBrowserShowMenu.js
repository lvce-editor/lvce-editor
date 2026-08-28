import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const showMenu = async (state, x, y) => {
  await ContextMenu.show2(state.uid, MenuEntryId.SimpleBrowserToolbar, x, y)
  return state
}
