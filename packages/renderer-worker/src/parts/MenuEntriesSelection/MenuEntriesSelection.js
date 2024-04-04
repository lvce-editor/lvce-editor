import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.Selection

export const getMenuEntries = () => {
  return [
    {
      id: 'selectAll',
      label: EditorStrings.selectAll(),
      flags: MenuItemFlags.None,
      command: 'Editor.selectAll',
    },
    {
      id: 'copyLineUp',
      label: EditorStrings.copyLineUp(),
      flags: MenuItemFlags.None,
      command: 'Editor.copyLineUp',
    },
    {
      id: 'copyLineDown',
      label: EditorStrings.copyLineDown(),
      flags: MenuItemFlags.None,
      command: 'Editor.copyLineDown',
    },
    {
      id: 'moveLineUp',
      label: EditorStrings.moveLineUp(),
      flags: MenuItemFlags.Disabled,
      command: 'Editor.moveLineUp',
    },
    {
      id: 'moveLineDown',
      label: EditorStrings.moveLineDown(),
      flags: MenuItemFlags.Disabled,
      command: 'Editor.moveLineDown',
    },
  ]
}
