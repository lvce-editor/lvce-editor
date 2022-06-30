import * as Command from '../Command/Command.js'

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
      label: 'Separator',
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'more',
      label: 'More...',
      flags: /* None */ 0,
      command: /* TODO show quick picker with more recently opened */ -1,
    },
    {
      id: 'separator',
      label: 'Separator',
      flags: /* Separator */ 1,
      command: /* None */ 0,
    },
    {
      id: 'clearRecentlyOpened',
      label: 'Clear Recently Opened',
      flags: /* None */ 0,
      command: 'RecentlyOpened.clearRecentlyOpened',
    },
  ]
}
