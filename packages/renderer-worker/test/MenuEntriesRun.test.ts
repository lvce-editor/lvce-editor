import { expect, test } from '@jest/globals'
import * as MenuEntriesRun from '../src/parts/MenuEntriesRun/MenuEntriesRun.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesRun.getMenuEntries()
  expect(menuEntries).toEqual([])
})
