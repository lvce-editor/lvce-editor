import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.js'

test('registers the go-to-line quick pick command', () => {
  expect(commandMap['QuickPick.openGoToLine']).toBeDefined()
})

test('registers the viewlet focus-selector bridge command', () => {
  expect(commandMap['Viewlet.focusSelector']).toBeDefined()
})

test('registers the viewlet reload command', () => {
  expect(commandMap['Viewlet.reload']).toBeDefined()
})

test('registers the terminal send text command', () => {
  expect(commandMap['Terminals.sendText']).toBeDefined()
})

test('registers the panel maximize commands', () => {
  expect(commandMap['Layout.maximizePanel']).toBeDefined()
  expect(commandMap['Layout.unmaximizePanel']).toBeDefined()
})
