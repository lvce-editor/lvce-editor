import { expect, test } from '@jest/globals'
import * as MenuEntriesSimpleBrowserToolbar from '../src/parts/MenuEntriesSimpleBrowserToolbar/MenuEntriesSimpleBrowserToolbar.js'
import * as MenuEntrySeparator from '../src/parts/MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('exposes useful Simple Browser actions in the toolbar menu', () => {
  expect(MenuEntriesSimpleBrowserToolbar.getMenuEntries()).toEqual([
    { command: 'SimpleBrowser.createNewTab', flags: MenuItemFlags.None, id: 'new-tab', label: 'New Tab' },
    { command: 'SimpleBrowser.reload', flags: MenuItemFlags.None, id: 'reload', label: 'Reload' },
    { command: 'SimpleBrowser.openExternal', flags: MenuItemFlags.None, id: 'open-external', label: 'Open in Default Browser' },
    MenuEntrySeparator.menuEntrySeparator,
    { command: 'SimpleBrowser.openHistory', flags: MenuItemFlags.None, id: 'history', label: 'History' },
    { command: 'SimpleBrowser.openDownloads', flags: MenuItemFlags.None, id: 'downloads', label: 'Downloads' },
    MenuEntrySeparator.menuEntrySeparator,
    { command: 'SimpleBrowser.zoomIn', flags: MenuItemFlags.None, id: 'zoom-in', label: 'Zoom In' },
    { command: 'SimpleBrowser.zoomOut', flags: MenuItemFlags.None, id: 'zoom-out', label: 'Zoom Out' },
    { command: 'SimpleBrowser.resetZoom', flags: MenuItemFlags.None, id: 'reset-zoom', label: 'Reset Zoom' },
    MenuEntrySeparator.menuEntrySeparator,
    { command: 'SimpleBrowser.toggleDevTools', flags: MenuItemFlags.None, id: 'toggle-developer-tools', label: 'Toggle Developer Tools' },
    MenuEntrySeparator.menuEntrySeparator,
    { command: 'SimpleBrowser.closeCurrentTab', flags: MenuItemFlags.None, id: 'close-tab', label: 'Close Tab' },
  ])
})
