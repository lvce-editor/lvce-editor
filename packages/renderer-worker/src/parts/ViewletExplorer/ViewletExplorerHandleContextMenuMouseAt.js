import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handleContextMenuMouseAt = async (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  await ContextMenu.show(x, y, MenuEntryId.Explorer)
  return {
    ...state,
    focusedIndex,
    focused: false,
  }
}
