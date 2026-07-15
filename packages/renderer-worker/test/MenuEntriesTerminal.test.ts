import { expect, test } from '@jest/globals'
import * as MenuEntriesTerminal from '../src/parts/MenuEntriesTerminal/MenuEntriesTerminal.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesTerminal.getMenuEntries()
  expect(menuEntries).toContainEqual({
    args: ['Terminals'],
    command: 'Layout.showPanel',
    flags: 0,
    id: 'newTerminal',
    label: 'New Terminal',
  })
})
