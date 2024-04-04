import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Path from '../Path/Path.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as SimpleBrowserStrings from '../SimpleBrowserStrings/SimpleBrowserStrings.js'

const getMenuEntriesLink = (x, y, params) => {
  const { linkURL } = params
  return [
    {
      id: 'open-link-in-new-tab',
      label: SimpleBrowserStrings.openLinkInNewTab(),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.openBackgroundTab',
      args: [linkURL],
    },
    {
      id: 'copy-link-address',
      label: SimpleBrowserStrings.copyLinkAddress(),
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
      label: SimpleBrowserStrings.inspectElement(),
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
      label: SimpleBrowserStrings.copy(),
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
      label: SimpleBrowserStrings.saveImageAs(),
      flags: MenuItemFlags.None,
      command: 'Download.downloadToDownloadsFolder',
      args: [fileName, srcURL],
    },
    {
      id: 'copy-image',
      label: SimpleBrowserStrings.copyImage(),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.copyImage',
      args: [x, y],
    },
  ]
}

export const id = MenuEntryId.SimpleBrowser

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
