import * as Command from '../Command/Command.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

const toContextMenuItem = (activityBarItem) => {
  return {
    label: activityBarItem.id,
    id: 8000, // TODO
    flags: MenuItemFlags.None,
    command: -1,
  }
}

export const id = MenuEntryId.ActivityBarAdditionalViews

export const getMenuEntries = async () => {
  const hiddenActivityBarItems = await Command.execute(/* ActivityBar.getHiddenItems */ 8011)
  return hiddenActivityBarItems.map(toContextMenuItem)
}
