import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const handleReadmeContextMenu = async (state, x, y, props) => {
  await ContextMenu.show(x, y, MenuEntryId.ExtensionDetailReadme, props)
  return state
}
