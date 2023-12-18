import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletTitleBarStrings from '../ViewletTitleBar/ViewletTitleBarStrings.js'

export const getMenuEntries = () => {
  return [
    {
      id: MenuEntryId.File,
      label: ViewletTitleBarStrings.file(),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Edit,
      label: ViewletTitleBarStrings.edit(),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Selection,
      label: ViewletTitleBarStrings.selection(),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.View,
      label: ViewletTitleBarStrings.view(),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Go,
      label: ViewletTitleBarStrings.go(),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Run,
      label: ViewletTitleBarStrings.run(),
      keyboardShortCut: 'Alt+r',
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Terminal,
      label: ViewletTitleBarStrings.terminal(),
      keyboardShortCut: 'Alt+t',
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Help,
      label: ViewletTitleBarStrings.help(),
      keyboardShortCut: 'Alt+h',
      flags: MenuItemFlags.SubMenu,
    },
  ]
}
