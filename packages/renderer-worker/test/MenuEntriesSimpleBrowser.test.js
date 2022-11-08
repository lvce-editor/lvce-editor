import * as MenuEntriesSimpleBrowser from '../src/parts/MenuEntriesSimpleBrowser/MenuEntriesSimpleBrowser.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries - link', () => {
  const params = {
    linkURL: 'https://example.com',
  }
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, params)
  expect(menuEntries[0]).toEqual({
    command: 'SimpleBrowser.openBackgroundTab',
    flags: MenuItemFlags.None,
    id: 'open-link-in-new-tab',
    label: 'Open Link in New Tab',
    args: ['https://example.com'],
  })
  expect(menuEntries[1]).toEqual({
    args: ['https://example.com'],
    command: 'ElectronClipBoard.writeText',
    flags: MenuItemFlags.None,
    id: 'copy-link-address',
    label: 'Copy Link Address',
  })
})

test('getMenuEntries - default', () => {
  const params = {}
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, params)
  expect(menuEntries[0]).toEqual({
    args: [0, 0],
    command: 'SimpleBrowser.inspectElement',
    flags: MenuItemFlags.None,
    id: 'inspect-element',
    label: 'Inspect Element',
  })
})

test('getMenuEntries - selectionText', () => {
  const params = {
    selectionText: 'abc',
    editFlags: {
      canCopy: true,
      canSelectAll: true,
    },
  }
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, params)
  expect(menuEntries[0]).toEqual({
    args: ['abc'],
    command: 'ElectronClipBoard.writeText',
    flags: MenuItemFlags.None,
    id: 'copy',
    label: 'Copy',
  })
})

test('getMenuEntries - image', () => {
  const params = {
    mediaType: 'image',
    srcURL: 'https://example.com/image.png',
  }
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, params)
  expect(menuEntries[0]).toEqual({
    command: 'Download.downloadToDownloadsFolder',
    flags: MenuItemFlags.None,
    id: 'save-image',
    label: 'Save Image',
    args: ['image.png', 'https://example.com/image.png'],
  })
  expect(menuEntries[1]).toEqual({
    command: 'SimpleBrowser.copyImage',
    flags: MenuItemFlags.None,
    id: 'copy-image',
    label: 'Copy Image',
    args: [0, 0],
  })
  expect(menuEntries[2]).toEqual({
    command: 'SimpleBrowser.inspectElement',
    flags: MenuItemFlags.None,
    id: 'inspect-element',
    label: 'Inspect Element',
    args: [0, 0],
  })
})
