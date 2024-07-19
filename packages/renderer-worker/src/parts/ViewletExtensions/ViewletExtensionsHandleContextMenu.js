import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

// @ts-ignore
const handleContextMenuMouse = (state, x, y) => {}

// @ts-ignore
const handleContextMenuIndex = (state, index) => {}

// TODO pass index instead
export const handleContextMenu = async (state, button, x, y) => {
  // TODO use focused index when when context menu button is -1 (keyboard)
  await ContextMenu.show(x, y, MenuEntryId.ManageExtension)
  return state
}
