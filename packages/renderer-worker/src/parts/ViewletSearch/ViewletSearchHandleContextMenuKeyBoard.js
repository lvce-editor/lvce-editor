import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuKeyboard = async (state) => {
  const x = state.x // TODO
  const y = state.y // TODO
  await ContextMenu.show(x, y, MenuEntryId.Search)
  return state
}
