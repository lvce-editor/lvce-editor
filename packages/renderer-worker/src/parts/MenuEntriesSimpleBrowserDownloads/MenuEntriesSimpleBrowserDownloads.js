import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.SimpleBrowserDownloads

export const getMenuEntries = () => [
  {
    id: 'show-downloads',
    label: 'Show downloads',
    flags: MenuItemFlags.None,
    command: 'SimpleBrowser.openDownloads',
  },
]
