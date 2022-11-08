import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

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
    {
      id: 'inspect',
      label: I18nString.i18nString(UiStrings.InspectElement),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.inspectElement',
      args: [x, y],
    },
  ]
}

const getMenuEntriesDefault = (x, y) => {
  return [
    {
      id: 'inspect-element',
      label: I18nString.i18nString(UiStrings.InspectElement),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.inspectElement',
      args: [x, y],
    },
    {
      id: 'cut',
      label: I18nString.i18nString(UiStrings.Cut),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.cut',
    },
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.copy',
    },
    {
      id: 'paste',
      label: I18nString.i18nString(UiStrings.Paste),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.paste',
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
    {
      id: 'inspect-element',
      label: I18nString.i18nString(UiStrings.InspectElement),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.inspectElement',
      args: [x, y],
    },
  ]
}

export const getMenuEntries = (x, y, params) => {
  if (params.linkURL) {
    return getMenuEntriesLink(x, y, params)
  }
  if (params.selectionText) {
    return getMenuEntriesSelectionText(x, y, params)
  }
  return getMenuEntriesDefault(x, y)
}
