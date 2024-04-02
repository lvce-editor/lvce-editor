import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  await Command.execute(/* ContextMenu.show */ 'ContextMenu.show', /* x */ x, /* y */ y, /* id */ MenuEntryId.Main)
  return state
}
