import { expect, jest, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.js'
import * as ClipBoardIpc from '../src/parts/ClipBoard/ClipBoard.ipc.js'

test('registers the go-to-line quick pick command', () => {
  expect(commandMap['QuickPick.openGoToLine']).toBeDefined()
})

test('registers the exclusive file creation command', () => {
  expect(commandMap['FileSystem.createFile']).toBeDefined()
})

test('registers the clipboard image read command', () => {
  expect(ClipBoardIpc.Commands.readImage).toBeDefined()
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

test('registers preview sandbox warning output commands', () => {
  expect(commandMap['Preview.logWarning']).toBeDefined()
  expect(commandMap['Preview.clearOutput']).toBeDefined()
})

test('registers the simple browser suggestion event bridge commands', () => {
  expect(commandMap['SimpleBrowser.acceptSuggestion']).toBeDefined()
  expect(commandMap['SimpleBrowser.closeSuggestions']).toBeDefined()
})

test('registers the simple browser event bridge commands', () => {
  expect(commandMap['ElectronBrowserView.handleAudioStateChanged']).toBeDefined()
  expect(commandMap['ElectronBrowserView.handleBrowserViewDestroyed']).toBeDefined()
  expect(commandMap['ElectronBrowserView.handleContextMenu']).toBeDefined()
  expect(commandMap['ElectronBrowserView.handlePageFaviconUpdated']).toBeDefined()
  expect(commandMap['ElectronBrowserView.handleWindowOpen']).toBeDefined()
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

test('registers the file handles command', () => {
  expect(commandMap['FileHandles.get']).toBeDefined()
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

test('window-close RPC commands preserve dirty results and save failures', async () => {
  const Command = await import('../src/parts/Command/Command.js')
  const dirty = jest.fn(() => true)
  const failure = new Error('disk full')
  Command.register('Main.hasDirtyTabs', dirty)
  Command.register('Main.saveAll', async () => {
    throw failure
  })
  await expect(commandMap['Main.hasDirtyTabs']()).resolves.toBe(true)
  await expect(commandMap['Main.saveAll']()).rejects.toBe(failure)
})
