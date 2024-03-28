import * as MenuEntriesView from '../src/parts/MenuEntriesView/MenuEntriesView.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesView.getMenuEntries()
  expect(menuEntries).toEqual([])
})
