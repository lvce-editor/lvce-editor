import * as Assert from '../Assert/Assert.ts'
import * as ElectronContextMenu from '../ElectronContextMenu/ElectronContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleContextMenu = async (state, params) => {
  Assert.object(state)
  Assert.object(params)
  const { x: paramsX, y: paramsY } = params
  const { canGoBack, canGoForward, headerHeight, x, y } = state
  const actualX = x + paramsX
  const actualY = y + headerHeight + paramsY
  const args = [actualX, actualY, { ...params, canGoBack, canGoForward }]
  await ElectronContextMenu.openContextMenu(actualX, actualY, MenuEntryId.SimpleBrowser, ...args)
  return state
}
