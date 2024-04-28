import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuKeyboard = async (state) => {
  const { focusedIndex, x, y, minLineY, itemHeight } = state
  const menuX = x
  const menuY = y + (focusedIndex - minLineY + 1) * itemHeight
  await ContextMenu.show(menuX, menuY, MenuEntryId.Explorer)
  return state
}
