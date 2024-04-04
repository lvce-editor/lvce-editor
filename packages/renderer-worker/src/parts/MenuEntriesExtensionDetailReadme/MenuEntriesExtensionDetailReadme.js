import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ViewletExtensionDetailStrings from '../ViewletExtensionDetail/ViewletExtensionDetailStrings.js'

export const id = MenuEntryId.ExtensionDetailReadme

export const getMenuEntries = (props) => {
  const menuEntries = []
  if (props.isLink) {
    menuEntries.push({
      id: 'openInNewTab',
      label: ViewletExtensionDetailStrings.openImageInNewTab(),
      flags: MenuItemFlags.None,
      command: 'Open.openUrl',
      args: [props.url],
    })
  } else if (props.isImage) {
    menuEntries.push(
      {
        id: 'openImageInNewTab',
        label: ViewletExtensionDetailStrings.openImageInNewTab(),
        flags: MenuItemFlags.None,
        command: 'Open.openUrl',
        args: [props.url],
      },
      {
        id: 'saveImageAs',
        label: ViewletExtensionDetailStrings.saveImageAs(),
        flags: MenuItemFlags.None,
        command: 'SaveFileAs.saveFileAs',
        args: ['image.png', props.url],
      },
    )
  }
  menuEntries.push({
    id: 'copy',
    label: ViewletExtensionDetailStrings.copy(),
    flags: MenuItemFlags.None,
    command: 'ClipBoard.execCopy',
  })
  return menuEntries
}
