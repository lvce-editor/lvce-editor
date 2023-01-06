import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuKeyboard = async (state) => {
  const { focusedIndex, x, y, minLineY, itemHeight } = state
  const menuX = x
  const menuY = y + (focusedIndex - minLineY + 1) * itemHeight
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ menuX, /* y */ menuY, /* id */ MenuEntryId.Explorer)
  return state
}
