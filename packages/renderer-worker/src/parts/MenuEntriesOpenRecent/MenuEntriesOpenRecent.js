import * as Command from '../Command/Command.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as PathDisplay from '../PathDisplay/PathDisplay.js'
import * as TitleBarMenuBarStrings from '../TitleBarMenuBarStrings/TitleBarMenuBarStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'


const MAX_MENU_RECENT_ENTRIES = 10

const toMenuItem = (folder) => {
  const label = PathDisplay.getTitle(folder)
  return {
    label,
    flags: MenuItemFlags.None,
    command: 'Workspace.setPath',
    args: [folder],
  }
}

const getRecentlyOpened = () => {
  return Command.execute(/* RecentlyOpened.getRecentlyOpened */ 'RecentlyOpened.getRecentlyOpened')
}

export const id = MenuEntryId.OpenRecent

export const getMenuEntries = async () => {
  const allItems = await getRecentlyOpened()
  const itemsToShow = allItems.slice(0, MAX_MENU_RECENT_ENTRIES)
  const items = []
  if (itemsToShow.length > 0) {
    items.push(...itemsToShow.map(toMenuItem), MenuEntrySeparator.menuEntrySeparator)
  }
  items.push(
    {
      id: 'more',
      label: TitleBarMenuBarStrings.moreDot(),
      flags: MenuItemFlags.None,
      command: 'QuickPick.showRecent',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'clearRecentlyOpened',
      label: TitleBarMenuBarStrings.clearRecentlyOpened(),
      flags: MenuItemFlags.None,
      command: 'RecentlyOpened.clearRecentlyOpened',
    },
  )
  return items
}
