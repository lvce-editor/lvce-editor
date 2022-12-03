import * as Assert from '../Assert/Assert.js'
import * as ElectronContextMenu from '../ElectronContextMenu/ElectronContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, params) => {
  Assert.object(state)
  Assert.object(params)
  const { x, y } = params
  const { top, headerHeight, left } = state
  const actualX = left + x
  const actualY = top + headerHeight + y
  const args = [actualX, actualY, params]
  await ElectronContextMenu.openContextMenu(
    actualX,
    actualY,
    MenuEntryId.SimpleBrowser,
    ...args
  )
  return state
}
