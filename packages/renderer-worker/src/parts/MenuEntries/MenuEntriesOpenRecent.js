import * as Command from '../Command/Command.js'
import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  Separator: 'Separator',
  More: 'More ...',
  ClearRecentlyOpened: 'More ...',
}

const MAX_MENU_RECENT_ENTRIES = 10

const toMenuItem = (folder) => {
  return {
    label: folder,
    flags: /* None */ 0,
    command: /* Workspace.setPath */ 'Workspace.setPath',
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
  return [
    ...itemsToShow.map(toMenuItem),
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.Separator),
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'more',
      label: I18nString.i18nString(UiStrings.More),
      flags: /* None */ 0,
      command: /* TODO show quick picker with more recently opened */ -1,
    },
    {
      id: 'separator',
      label: I18nString.i18nString(UiStrings.More),
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'clearRecentlyOpened',
      label: I18nString.i18nString(UiStrings.ClearRecentlyOpened),
      flags: /* None */ 0,
      command: 'RecentlyOpened.clearRecentlyOpened',
    },
  ]
}
