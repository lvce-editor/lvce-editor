import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, button, x, y) => {
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.ActivityBar)
  return state
}
