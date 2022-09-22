import * as Command from '../Command/Command.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Separator: 'Separator',
  More: 'More ...',
  ClearRecentlyOpened: 'Clear Recently Opened',
}

const MAX_MENU_RECENT_ENTRIES = 10

const toMenuItem = (folder) => {
  return {
    label: folder,
    flags: MenuItemFlags.None,
    command: 'Workspace.setPath',
    args: [folder],
  }
}

const getRecentlyOpened = () => {
  return Command.execute(
    /* RecentlyOpened.getRecentlyOpened */ 'RecentlyOpened.getRecentlyOpened'
  )
}

export const getMenuEntries = async () => {
  const allItems = await getRecentlyOpened()
  const itemsToShow = allItems.slice(0, MAX_MENU_RECENT_ENTRIES)
  const items = []
  if (itemsToShow.length > 0) {
    items.push(...itemsToShow.map(toMenuItem), {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: MenuItemFlags.Separator,
      command: MenuItemFlags.None,
    })
  }
  items.push(
    {
      id: 'more',
      label: I18nString.i18nString(UiStrings.More),
      flags: MenuItemFlags.None,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'recent'],
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.More),
      flags: MenuItemFlags.Separator,
      command: MenuItemFlags.None,
    },
    {
      id: 'clearRecentlyOpened',
      label: I18nString.i18nString(UiStrings.ClearRecentlyOpened),
      flags: MenuItemFlags.None,
      command: 'RecentlyOpened.clearRecentlyOpened',
    }
  )
  return items
}
