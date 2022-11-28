import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Copy: 'Copy',
  OpenInNewTab: 'Open in New Tab',
  OpenImageInNewTab: 'Open Image in New Tab',
  SaveImageAs: 'Save Image as',
}

export const getMenuEntries = (props) => {
  console.log({ props })
  const menuEntries = []
  if (props.isLink) {
    menuEntries.push({
      id: 'openInNewTab',
      label: I18nString.i18nString(UiStrings.OpenInNewTab),
      flags: MenuItemFlags.None,
      command: 'Open.openUrl',
      args: [props.url],
    })
  } else if (props.isImage) {
    menuEntries.push(
      {
        id: 'openImageInNewTab',
        label: I18nString.i18nString(UiStrings.OpenImageInNewTab),
        flags: MenuItemFlags.None,
        command: 'Open.openUrl',
        args: [props.url],
      },
      {
        id: 'saveImageAs',
        label: I18nString.i18nString(UiStrings.SaveImageAs),
        flags: MenuItemFlags.None,
        command: 'SaveFileAs.saveFileAs',
        args: ['image.png', props.url],
      }
    )
  }
  menuEntries.push({
    id: 'copy',
    label: I18nString.i18nString(UiStrings.Copy),
    flags: MenuItemFlags.None,
    command: 'ClipBoard.execCopy',
  })
  return menuEntries
}
