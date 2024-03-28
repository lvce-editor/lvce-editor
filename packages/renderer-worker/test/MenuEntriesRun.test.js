import * as MenuEntriesRun from '../src/parts/MenuEntriesRun/MenuEntriesRun.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesRun.getMenuEntries()
  expect(menuEntries).toEqual([])
})
