import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenuKeyboard = async (state) => {
  const index = 1
  const x = state.x // TODO
  const y = state.y // TODO
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Search)
  return state
}
