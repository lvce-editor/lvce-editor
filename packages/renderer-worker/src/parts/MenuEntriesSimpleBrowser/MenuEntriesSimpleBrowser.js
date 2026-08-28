import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
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
      id: 'back',
      label: SimpleBrowserStrings.back(),
      flags: params.canGoBack ? MenuItemFlags.None : MenuItemFlags.Disabled,
      command: 'SimpleBrowser.backward',
    },
    {
      id: 'forward',
      label: SimpleBrowserStrings.forward(),
      flags: params.canGoForward ? MenuItemFlags.None : MenuItemFlags.Disabled,
      command: 'SimpleBrowser.forward',
    },
    {
      id: 'reload',
      label: SimpleBrowserStrings.reload(),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.reload',
    },
    MenuEntrySeparator.menuEntrySeparator,
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
      id: 'open-image-in-new-tab',
      label: SimpleBrowserStrings.openImageInNewTab(),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.openBackgroundTab',
      args: [srcURL],
    },
    {
      id: 'copy-image-address',
      label: SimpleBrowserStrings.copyImageAddress(),
      flags: MenuItemFlags.None,
      command: 'ElectronClipBoard.writeText',
      args: [srcURL],
    },
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
    menuItems.push(MenuEntrySeparator.menuEntrySeparator)
  }
  if (params.selectionText) {
    menuItems.push(...getMenuEntriesSelectionText(x, y, params))
    menuItems.push(MenuEntrySeparator.menuEntrySeparator)
  }
  if (params.mediaType === 'image') {
    menuItems.push(...getMenuEntriesImage(x, y, params))
    menuItems.push(MenuEntrySeparator.menuEntrySeparator)
  }
  menuItems.push(...getMenuEntriesDefault(x, y, params))
  return menuItems
}
