import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleTabContextMenu = async (state, index, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { tabs, uid } = state
  const tabIndex = Number(index)
  if (tabIndex < 0 || tabIndex >= tabs.length) {
    return state
  }
  await ContextMenu.show2(uid, MenuEntryId.SimpleBrowserTab, x, y, tabIndex)
  return state
}
