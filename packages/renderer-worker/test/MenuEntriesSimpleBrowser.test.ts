import { expect, test } from '@jest/globals'
import * as MenuEntriesSimpleBrowser from '../src/parts/MenuEntriesSimpleBrowser/MenuEntriesSimpleBrowser.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries - link', () => {
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, {
    linkURL: 'https://example.com',
  })

  expect(menuEntries.slice(0, 2)).toEqual([
    {
      args: ['https://example.com'],
      command: 'SimpleBrowser.openBackgroundTab',
      flags: MenuItemFlags.None,
      id: 'open-link-in-new-tab',
      label: 'Open Link in New Tab',
    },
    {
      args: ['https://example.com'],
      command: 'ElectronClipBoard.writeText',
      flags: MenuItemFlags.None,
      id: 'copy-link-address',
      label: 'Copy Link Address',
    },
  ])
})

test('getMenuEntries - default browser actions', () => {
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(10, 20, {
    canGoBack: false,
    canGoForward: true,
  })

  expect(menuEntries).toEqual([
    { command: 'SimpleBrowser.backward', flags: MenuItemFlags.Disabled, id: 'back', label: 'Back' },
    { command: 'SimpleBrowser.forward', flags: MenuItemFlags.None, id: 'forward', label: 'Forward' },
    { command: 'SimpleBrowser.reload', flags: MenuItemFlags.None, id: 'reload', label: 'Reload' },
    { command: '', flags: MenuItemFlags.Separator, id: 'separator', label: '' },
    {
      args: [10, 20],
      command: 'SimpleBrowser.inspectElement',
      flags: MenuItemFlags.None,
      id: 'inspect-element',
      label: 'Inspect Element',
    },
  ])
})

test('getMenuEntries - selection text', () => {
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, {
    editFlags: { canCopy: true, canSelectAll: true },
    selectionText: 'abc',
  })

  expect(menuEntries[0]).toEqual({
    args: ['abc'],
    command: 'ElectronClipBoard.writeText',
    flags: MenuItemFlags.None,
    id: 'copy',
    label: 'Copy',
  })
})

test('getMenuEntries - image', () => {
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, {
    mediaType: 'image',
    srcURL: 'https://example.com/image.png',
  })

  expect(menuEntries.slice(0, 4)).toEqual([
    {
      args: ['https://example.com/image.png'],
      command: 'SimpleBrowser.openBackgroundTab',
      flags: MenuItemFlags.None,
      id: 'open-image-in-new-tab',
      label: 'Open Image in New Tab',
    },
    {
      args: ['https://example.com/image.png'],
      command: 'ElectronClipBoard.writeText',
      flags: MenuItemFlags.None,
      id: 'copy-image-address',
      label: 'Copy Image Address',
    },
    {
      args: ['image.png', 'https://example.com/image.png'],
      command: 'Download.downloadToDownloadsFolder',
      flags: MenuItemFlags.None,
      id: 'save-image',
      label: 'Save Image',
    },
    {
      args: [0, 0],
      command: 'SimpleBrowser.copyImage',
      flags: MenuItemFlags.None,
      id: 'copy-image',
      label: 'Copy Image',
    },
  ])
})

test('getMenuEntries - linked image includes link and image actions', () => {
  const menuEntries = MenuEntriesSimpleBrowser.getMenuEntries(0, 0, {
    linkURL: 'https://example.com',
    mediaType: 'image',
    srcURL: 'https://example.com/image.png',
  })

  const ids: string[] = []
  for (const entry of menuEntries) {
    ids.push(entry.id)
  }
  expect(ids).toEqual([
    'open-link-in-new-tab',
    'copy-link-address',
    'separator',
    'open-image-in-new-tab',
    'copy-image-address',
    'save-image',
    'copy-image',
    'separator',
    'back',
    'forward',
    'reload',
    'separator',
    'inspect-element',
  ])
})
