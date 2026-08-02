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

test('updateAllDiagnostics refreshes diagnostics for every open editor', async () => {
  await GetActiveEditor.updateAllDiagnosticsWithCommand(executeCommand)

  expect(executeCommand).toHaveBeenCalledWith('Editor.updateDiagnosticsAll')
})

test('getOpenEditorUris returns tabs from every editor group', async () => {
  ViewletStates.set('Main', {
    factory: {},
    moduleId: 'Main',
    renderedState: { uid: 1 },
    state: { uid: 1 },
  })
  const invoke = jest.fn(async () => ({
    layout: {
      groups: [
        { tabs: [{ uri: 'file:///workspace/src/app.ts' }, { uri: 'search-editor://1/Search' }] },
        { tabs: [{ uri: 'file:///workspace/README.md' }, { label: 'untitled' }] },
      ],
    },
  }))

  await expect(GetActiveEditor.getOpenEditorUrisWithInvoke(invoke)).resolves.toEqual([
    'file:///workspace/src/app.ts',
    'search-editor://1/Search',
    'file:///workspace/README.md',
  ])
  expect(invoke).toHaveBeenCalledWith('MainArea.saveState', 1)
})

test('getOpenEditorUris returns an empty array without a main area', async () => {
  const invoke = jest.fn()
  await expect(GetActiveEditor.getOpenEditorUrisWithInvoke(invoke)).resolves.toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})
