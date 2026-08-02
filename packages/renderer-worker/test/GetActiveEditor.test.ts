// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

const GetActiveEditor = await import('../src/parts/GetActiveEditor/GetActiveEditor.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const executeCommand = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
})

test('updateDiagnostics does nothing when there is no active editor', async () => {
  await expect(GetActiveEditor.updateDiagnosticsWithCommand(executeCommand)).resolves.toBeUndefined()
  expect(executeCommand).not.toHaveBeenCalled()
})

test('updateDiagnostics refreshes diagnostics for the active editor', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.js',
    },
  })

  await GetActiveEditor.updateDiagnosticsWithCommand(executeCommand)

  expect(executeCommand).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'updateDiagnostics')
})
