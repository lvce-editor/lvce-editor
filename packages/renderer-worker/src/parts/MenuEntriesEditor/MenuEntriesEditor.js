import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'go-to-definition',
      label: EditorStrings.goToDefinition(),
      flags: MenuItemFlags.None,
      command: 'Editor.goToDefinition',
    },
    {
      id: 'go-to-type-definition',
      label: EditorStrings.goToTypeDefinition(),
      flags: MenuItemFlags.None,
      command: /* Editor.goToTypeDefinition */ 'Editor.goToTypeDefinition',
    },
    {
      id: 'separator',
      label: EditorStrings.separator(),
      flags: MenuItemFlags.Separator,
      command: '',
    },
    {
      id: 'find-all-references',
      label: EditorStrings.findAllReferences(),
      flags: MenuItemFlags.None,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'References', /* focus */ true],
    },
    {
      id: 'find-all-implementations',
      label: EditorStrings.findAllImplementations(),
      flags: MenuItemFlags.None,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'Implementations', /* focus */ true],
    },
    {
      id: 'separator',
      label: EditorStrings.separator(),
      flags: MenuItemFlags.Separator,
      command: '',
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
  ]
}
