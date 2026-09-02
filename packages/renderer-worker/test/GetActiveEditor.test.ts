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

test('getDiagnostics returns diagnostics for the active editor', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.js',
    },
  })
  const diagnostics = [{ message: 'Unexpected semicolon', rowIndex: 0 }]
  const invoke = jest.fn(async () => diagnostics)

  await expect(GetActiveEditor.getDiagnosticsWithInvoke(invoke)).resolves.toEqual(diagnostics)
  expect(invoke).toHaveBeenCalledWith('Editor.getDiagnostics', 42)
})

test('getDiagnostics returns an empty array when there is no active editor', async () => {
  const invoke = jest.fn()

  await expect(GetActiveEditor.getDiagnosticsWithInvoke(invoke)).resolves.toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('getTextDocument returns the active text document', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.js',
    },
  })
  const invoke = jest.fn(async () => 'debugger')

  await expect(GetActiveEditor.getTextDocumentWithInvoke(invoke)).resolves.toEqual({
    text: 'debugger',
    uri: 'file:///test.js',
  })
  expect(invoke).toHaveBeenCalledWith('Editor.getText', 42)
})

test('getTextDocument returns undefined when there is no active editor', async () => {
  const invoke = jest.fn()

  await expect(GetActiveEditor.getTextDocumentWithInvoke(invoke)).resolves.toBeUndefined()
  expect(invoke).not.toHaveBeenCalled()
})

test('getSelections returns selections for the active editor', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.js',
    },
  })
  const invoke = jest.fn(async () => new Uint32Array([1, 2, 3, 4]))

  await expect(GetActiveEditor.getSelectionsWithInvoke(invoke)).resolves.toEqual([1, 2, 3, 4])
  expect(invoke).toHaveBeenCalledWith('Editor.getSelections2', 42)
})

test('getSelections returns an empty array when there is no active editor', async () => {
  const invoke = jest.fn()

  await expect(GetActiveEditor.getSelectionsWithInvoke(invoke)).resolves.toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('getSelectionText returns the primary selection text', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.txt',
    },
  })
  const invoke = jest.fn(async (command: string) => {
    if (command === 'Editor.getText') {
      return 'prefix abc suffix'
    }
    return new Uint32Array([0, 7, 0, 10])
  })

  await expect(GetActiveEditor.getSelectionTextWithInvoke(invoke)).resolves.toBe('abc')
})

test('getSelectionText normalizes a reversed selection', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.txt',
    },
  })
  const invoke = jest.fn(async (command: string) => {
    if (command === 'Editor.getText') {
      return 'prefix abc suffix'
    }
    return new Uint32Array([0, 10, 0, 7])
  })

  await expect(GetActiveEditor.getSelectionTextWithInvoke(invoke)).resolves.toBe('abc')
})

test('getSelectionText returns a multiline selection', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.txt',
    },
  })
  const invoke = jest.fn(async (command: string) => {
    if (command === 'Editor.getText') {
      return 'one two\nthree four'
    }
    return new Uint32Array([0, 4, 1, 5])
  })

  await expect(GetActiveEditor.getSelectionTextWithInvoke(invoke)).resolves.toBe('two\nthree')
})

test('getSelectionText returns an empty string without an active editor', async () => {
  const invoke = jest.fn()

  await expect(GetActiveEditor.getSelectionTextWithInvoke(invoke)).resolves.toBe('')
  expect(invoke).not.toHaveBeenCalled()
})

test('getSelectionText returns an empty string without a complete selection', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.txt',
    },
  })
  const invoke = jest.fn(async (command: string) => {
    if (command === 'Editor.getText') {
      return 'text'
    }
    return new Uint32Array()
  })

  await expect(GetActiveEditor.getSelectionTextWithInvoke(invoke)).resolves.toBe('')
})

test('setSelections updates selections for the active editor', async () => {
  ViewletStates.set(1, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: {},
    state: {
      id: 42,
      uri: 'file:///test.js',
    },
  })

  await GetActiveEditor.setSelectionsWithCommand(executeCommand, [1, 2, 3, 4])

  expect(executeCommand).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'setSelections', new Uint32Array([1, 2, 3, 4]))
})

test('setSelections does nothing when there is no active editor', async () => {
  await expect(GetActiveEditor.setSelectionsWithCommand(executeCommand, [1, 2, 3, 4])).resolves.toBeUndefined()
  expect(executeCommand).not.toHaveBeenCalled()
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
