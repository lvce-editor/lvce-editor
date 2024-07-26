import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuMouseAt = async (state, x, y) => {
  await ContextMenu.show(x, y, MenuEntryId.Search)
  return state
}
