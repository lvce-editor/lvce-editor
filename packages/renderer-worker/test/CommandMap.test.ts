import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.js'

test('registers the go-to-line quick pick command', () => {
  expect(commandMap['QuickPick.openGoToLine']).toBeDefined()
})
