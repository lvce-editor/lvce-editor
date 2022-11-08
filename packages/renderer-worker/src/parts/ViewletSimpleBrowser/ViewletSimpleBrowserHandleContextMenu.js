// import * as ElectronContextMenu from '../ElectronMenu/ElectronMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
// import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'

export const handleContextMenu = async (state, x, y) => {
  // const entries = await MenuEntries.getMenuEntries(MenuEntryId.SimpleBrowser)
  await ElectronMenu.openContextMenu(x, y, MenuEntryId.SimpleBrowser)
  // console.log({ x, y, entries })
  // TODO
  return state
}
