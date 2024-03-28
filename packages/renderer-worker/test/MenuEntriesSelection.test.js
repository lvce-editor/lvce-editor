import * as MenuEntriesSelection from '../src/parts/MenuEntriesSelection/MenuEntriesSelection.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  expect(MenuEntriesSelection.getMenuEntries()).toContainEqual({
    id: 'selectAll',
    label: 'Select All',
    flags: MenuItemFlags.None,
    command: 'Editor.selectAll',
  })
})
