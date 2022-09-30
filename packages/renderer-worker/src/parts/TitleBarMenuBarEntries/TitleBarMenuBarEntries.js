import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const getEntries = () => {
  return MenuEntries.getMenuEntries(MenuEntryId.TitleBar)
}
