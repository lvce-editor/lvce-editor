import { expect, test } from '@jest/globals'
import * as MenuEntriesSimpleBrowserDownloads from '../src/parts/MenuEntriesSimpleBrowserDownloads/MenuEntriesSimpleBrowserDownloads.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('exposes the Show downloads action in its own menu', () => {
  expect(MenuEntriesSimpleBrowserDownloads.id).toBe(MenuEntryId.SimpleBrowserDownloads)
  expect(MenuEntriesSimpleBrowserDownloads.getMenuEntries()).toEqual([
    {
      id: 'show-downloads',
      label: 'Show downloads',
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.openDownloads',
    },
  ])
})
