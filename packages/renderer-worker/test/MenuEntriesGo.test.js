import * as MenuEntriesGo from '../src/parts/MenuEntriesGo/MenuEntriesGo.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesGo.getMenuEntries()
  expect(menuEntries).toEqual([])
})
