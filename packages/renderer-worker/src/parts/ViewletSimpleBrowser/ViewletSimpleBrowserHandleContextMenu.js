import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

export const handleContextMenu = async (state, x, y) => {
  const { top, headerHeight, left } = state
  const actualX = left + x
  const actualY = top + headerHeight + y
  await ElectronMenu.openContextMenu(
    actualX,
    actualY,
    MenuEntryId.SimpleBrowser
  )
  return state
}
