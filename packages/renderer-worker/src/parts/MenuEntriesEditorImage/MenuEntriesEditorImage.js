import * as EditorImageStrings from '../EditorImageStrings/EditorImageStrings.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: EditorImageStrings.copy(),
      flags: MenuItemFlags.None,
      command: 'EditorImage.copyImage',
    },
    {
      id: 'copyToClipBoard',
      label: EditorImageStrings.copyPath(),
      flags: MenuItemFlags.None,
      command: 'EditorImage.copyPath',
    },
  ]
}
