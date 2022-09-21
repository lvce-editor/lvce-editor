import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import { getIndexFromPosition } from './ViewletExplorerShared.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuMouseAt = async (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const focusedIndex = getIndexFromPosition(state, x, y)
  await Command.execute(
    /* ContextMenu.show */ 'ContextMenu.show',
    /* x */ x,
    /* y */ y,
    /* id */ MenuEntryId.Explorer
  )
  return {
    ...state,
    focusedIndex,
    focused: false,
  }
}
