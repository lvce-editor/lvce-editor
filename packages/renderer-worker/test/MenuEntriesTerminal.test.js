import { expect, test } from '@jest/globals'
import * as MenuEntriesTerminal from '../src/parts/MenuEntriesTerminal/MenuEntriesTerminal.js'

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
