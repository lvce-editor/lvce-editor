import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, x, y) => {
  Assert.number(x)
  Assert.number(y)
  await ContextMenu.show(x, y, MenuEntryId.Main)
  return state
}
