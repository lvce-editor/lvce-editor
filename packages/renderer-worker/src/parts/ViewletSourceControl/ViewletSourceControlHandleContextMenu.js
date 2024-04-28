import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, button, x, y) => {
  await ContextMenu.show(x, y, MenuEntryId.SourceControl)
  return state
}
