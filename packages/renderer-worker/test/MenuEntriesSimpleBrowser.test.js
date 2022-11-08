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
