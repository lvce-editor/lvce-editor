import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Path from '../Path/Path.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  InspectElement: 'Inspect Element',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  OpenLinkInNewTab: 'Open Link in New Tab',
  CopyLinkAddress: 'Copy Link Address',
  SaveImageAs: 'Save Image',
  CopyImage: 'Copy Image',
}

const getMenuEntriesLink = (x, y, params) => {
  const { linkURL } = params
  return [
    {
      id: 'open-link-in-new-tab',
      label: I18nString.i18nString(UiStrings.OpenLinkInNewTab),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.openBackgroundTab',
      args: [linkURL],
    },
    {
      id: 'copy-link-address',
      label: I18nString.i18nString(UiStrings.CopyLinkAddress),
      flags: MenuItemFlags.None,
      command: 'ElectronClipBoard.writeText',
      args: [linkURL],
    },
  ]
}

const getMenuEntriesDefault = (x, y, params) => {
  return [
    {
      id: 'inspect-element',
      label: I18nString.i18nString(UiStrings.InspectElement),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.inspectElement',
      args: [x, y],
    },
  ]
}

const getMenuEntriesSelectionText = (x, y, params) => {
  const { selectionText } = params
  return [
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'ElectronClipBoard.writeText',
      args: [selectionText],
    },
  ]
}

const getMenuEntriesImage = (x, y, params) => {
  const { srcURL } = params
  const fileName = Path.getBaseName(PathSeparatorType.Slash, srcURL)
  return [
    {
      id: 'save-image',
      label: I18nString.i18nString(UiStrings.SaveImageAs),
      flags: MenuItemFlags.None,
      command: 'Download.downloadToDownloadsFolder',
      args: [fileName, srcURL],
    },
    {
      id: 'copy-image',
      label: I18nString.i18nString(UiStrings.CopyImage),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.copyImage',
      args: [x, y],
    },
  ]
}

export const getMenuEntries = (x, y, params) => {
  const menuItems = []
  if (params.linkURL) {
    menuItems.push(...getMenuEntriesLink(x, y, params))
  }
  if (params.selectionText) {
    menuItems.push(...getMenuEntriesSelectionText(x, y, params))
  }
  if (params.mediaType === 'image') {
    menuItems.push(...getMenuEntriesImage(x, y, params))
  }
  menuItems.push(...getMenuEntriesDefault(x, y, params))
  return menuItems
}
