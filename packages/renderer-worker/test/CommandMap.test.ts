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

test('registers the simple browser suggestion event bridge commands', () => {
  expect(commandMap['SimpleBrowser.acceptSuggestion']).toBeDefined()
  expect(commandMap['SimpleBrowser.closeSuggestions']).toBeDefined()
})

test('registers the simple browser favicon event bridge command', () => {
  expect(commandMap['ElectronBrowserView.handlePageFaviconUpdated']).toBeDefined()
})

test('registers the panel maximize commands', () => {
  expect(commandMap['Layout.maximizePanel']).toBeDefined()
  expect(commandMap['Layout.unmaximizePanel']).toBeDefined()
})

test('registers the menu select-current command', () => {
  expect(commandMap['Menu.selectCurrent']).toBeDefined()
})

test('registers the drop data command', () => {
  expect(commandMap['DropData.get']).toBeDefined()
})

test('registers the active text document command', () => {
  expect(commandMap['GetActiveEditor.getTextDocument']).toBeDefined()
})

test('registers only direct extension node process commands', () => {
  expect(commandMap['ExtensionNodeRpc.createConnection']).toBeDefined()
  expect(commandMap['ExtensionNodeRpc.createMessagePort']).toBeDefined()
  expect(commandMap['ExtensionNodeRpc.create']).toBeUndefined()
  expect(commandMap['ExtensionNodeRpc.dispose']).toBeUndefined()
  expect(commandMap['ExtensionNodeRpc.invoke']).toBeUndefined()
})
