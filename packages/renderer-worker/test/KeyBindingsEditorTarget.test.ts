import { beforeEach, expect, jest, test } from '@jest/globals'
import * as Command from '../src/parts/Command/Command.js'
import * as KeyBindings from '../src/parts/KeyBindings/KeyBindings.js'
import * as KeyBindingsState from '../src/parts/KeyBindingsState/KeyBindingsState.js'
import * as ViewletStates from '../src/parts/ViewletStates/ViewletStates.js'

const globalCommand = jest.fn<(...args: readonly unknown[]) => Promise<void>>()

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
  KeyBindingsState.state.matchingKeyBindings = [{ command: 'Editor.cursorDocumentStart', key: 1 }]
  Command.register('Editor.cursorDocumentStart', globalCommand)
})

test.each([
  ['Editor.cursorDocumentStart', 'cursorDocumentStart'],
  ['Editor.deleteLeft', 'deleteLeft'],
  ['Editor.save', 'Editor.save'],
])('dispatches %s to the captured editor after focus changes', async (command, method) => {
  KeyBindingsState.state.matchingKeyBindings = [{ command, key: 1 }]
  const cursorDocumentStart = jest.fn((state: Readonly<{ uid: number }>) => state)
  const source = { uid: 42 }
  const preview = { uid: 43 }
  for (const state of [source, preview]) {
    const { uid } = state
    ViewletStates.set(uid, {
      factory: { Commands: { [method]: cursorDocumentStart } },
      moduleId: 'Editor',
      renderedState: state,
      state,
    })
  }
  ViewletStates.setFocusedInstanceByType(43, 'Editor')

  await KeyBindings.handleKeyBinding(1, 42)

  expect(cursorDocumentStart).toHaveBeenCalledTimes(1)
  expect(cursorDocumentStart).toHaveBeenCalledWith(source)
  expect(ViewletStates.getFocusedInstanceByType('Editor')).toBe(43)
  expect(globalCommand).not.toHaveBeenCalled()
})

test('drops a shortcut whose original editor was closed', async () => {
  await KeyBindings.handleKeyBinding(1, 42)

  expect(globalCommand).not.toHaveBeenCalled()
})

test('preserves ordinary dispatch when no editor target was supplied', async () => {
  await KeyBindings.handleKeyBinding(1)

  expect(globalCommand).toHaveBeenCalledWith()
})

test('preserves non-editor commands and their arguments', async () => {
  KeyBindingsState.state.matchingKeyBindings = [{ args: ['sample.command'], command: 'ExtensionHost.executeCommand', key: 1 }]
  Command.register('ExtensionHost.executeCommand', globalCommand)

  await KeyBindings.handleKeyBinding(1, 42)

  expect(globalCommand).toHaveBeenCalledWith('sample.command')
})
