import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

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
    {
      id: 'separator',
      label: '',
      flags: MenuItemFlags.Separator,
      command: /* TODO */ -1,
    },
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
    {
      id: 'separator',
      label: '',
      flags: MenuItemFlags.Separator,
      command: /* TODO */ -1,
    },
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
