import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const id = MenuEntryId.Edit

export const getMenuEntries = () => {
  return [
    {
      id: 'undo',
      label: EditorStrings.undo(),
      flags: MenuItemFlags.Disabled,
      command: /* TODO */ -1,
    },
    {
      id: 'redo',
      label: EditorStrings.redo(),
      flags: MenuItemFlags.Disabled,
      command: /* TODO */ -1,
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'cut',
      label: EditorStrings.cut(),
      flags: MenuItemFlags.None,
      command: /* Editor.cut */ 'Editor.cut',
    },
    {
      id: 'copy',
      label: EditorStrings.copy(),
      flags: MenuItemFlags.None,
      command: /* Editor.copy */ 'Editor.copy',
    },
    {
      id: 'paste',
      label: EditorStrings.paste(),
      flags: MenuItemFlags.None,
      command: /* Editor.paste */ 'Editor.paste',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'toggle-line-comment',
      label: EditorStrings.toggleLineComment(),
      flags: MenuItemFlags.None,
      command: /* Editor.toggleLineComment */ 'Editor.toggleLineComment',
    },
    {
      id: 'toggle-block-comment',
      label: EditorStrings.toggleBlockComment(),
      flags: MenuItemFlags.None,
      command: /* Editor.toggleBlockComment */ 'Editor.toggleBlockComment',
    },
  ]
}
