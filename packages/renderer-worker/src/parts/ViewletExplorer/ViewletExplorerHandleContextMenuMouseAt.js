import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'

export const handleContextMenuMouseAt = async (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Explorer)
  return {
    ...state,
    focusedIndex,
    focused: false,
  }
}
