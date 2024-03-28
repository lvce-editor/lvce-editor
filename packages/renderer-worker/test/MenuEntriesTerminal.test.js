import * as MenuEntriesTerminal from '../src/parts/MenuEntriesTerminal/MenuEntriesTerminal.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesTerminal.getMenuEntries()
  expect(menuEntries).toContainEqual({
    args: ['Terminal'],
    command: 'Layout.togglePanel',
    flags: 0,
    id: 'newTerminal',
    label: 'New Terminal',
  })
})
