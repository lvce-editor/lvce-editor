import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'
import * as ElectronContextMenuType from '../ElectronContextMenuType/ElectronContextMenuType.js'
import * as Assert from '../Assert/Assert.js'

export const handleContextMenu = async (state, params) => {
  Assert.object(state)
  Assert.object(params)
  const { x, y } = params
  const { top, headerHeight, left } = state
  const actualX = left + x
  const actualY = top + headerHeight + y
  console.log({ params })
  const args = [actualX, actualY, params]
  await ElectronMenu.openContextMenu(
    actualX,
    actualY,
    MenuEntryId.SimpleBrowser,
    ...args
  )
  return state
}
