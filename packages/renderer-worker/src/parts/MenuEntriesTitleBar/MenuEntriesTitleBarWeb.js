import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarStrings from '../ViewletTitleBar/ViewletTitleBarStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: MenuEntryId.File,
      label: ViewletTitleBarStrings.file(),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Edit,
      label: ViewletTitleBarStrings.edit(),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Selection,
      label: ViewletTitleBarStrings.selection(),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.View,
      label: ViewletTitleBarStrings.view(),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Go,
      label: ViewletTitleBarStrings.go(),
      flags: MenuItemFlags.None,
    },
  ]
}
