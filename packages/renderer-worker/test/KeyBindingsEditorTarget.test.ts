import { beforeEach, expect, jest, test } from '@jest/globals'

const executeCommand = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
const executeViewletCommand = jest.fn<(...args: readonly unknown[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute: executeCommand }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ executeViewletCommand }))

const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
  KeyBindingsState.state.matchingKeyBindings = [{ key: 1, command: 'Editor.cursorDocumentStart' }]
})

test('dispatches to the captured editor after focus moves to a different editor', async () => {
  for (const uid of [42, 43]) {
    ViewletStates.set(uid, { factory: {}, moduleId: 'Editor', renderedState: { uid }, state: { uid } })
  }
  ViewletStates.setFocusedInstanceByType(43, 'Editor')

  await KeyBindings.handleKeyBinding(1, 42)

  expect(executeViewletCommand).toHaveBeenCalledWith(42, 'Editor.cursorDocumentStart')
  expect(executeCommand).not.toHaveBeenCalled()
})

test('drops a shortcut whose original editor was closed', async () => {
  await KeyBindings.handleKeyBinding(1, 42)

  expect(executeViewletCommand).not.toHaveBeenCalled()
  expect(executeCommand).not.toHaveBeenCalled()
})

test('preserves ordinary dispatch when no editor target was supplied', async () => {
  await KeyBindings.handleKeyBinding(1)

  expect(executeCommand).toHaveBeenCalledWith('Editor.cursorDocumentStart')
  expect(executeViewletCommand).not.toHaveBeenCalled()
})

test('preserves non-editor commands and their arguments', async () => {
  KeyBindingsState.state.matchingKeyBindings = [{ key: 1, command: 'ExtensionHost.executeCommand', args: ['sample.command'] }]
  await KeyBindings.handleKeyBinding(1, 42)

  expect(executeCommand).toHaveBeenCalledWith('ExtensionHost.executeCommand', 'sample.command')
  expect(executeViewletCommand).not.toHaveBeenCalled()
})
