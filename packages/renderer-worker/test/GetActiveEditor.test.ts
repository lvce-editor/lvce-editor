// @ts-nocheck
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const ApplicationRegistry = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')
afterEach(() => {
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
})

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

test('getVisibleEditorUris returns the selected tab from every editor group', async () => {
  ViewletStates.set('Main', {
    factory: {},
    moduleId: 'Main',
    renderedState: { uid: 1 },
    state: { uid: 1 },
  })
  const invoke = jest.fn(async () => ({
    layout: {
      groups: [
        {
          activeTabId: 2,
          tabs: [
            { id: 1, uri: 'file:///workspace/hidden.ts' },
            { id: 2, uri: 'file:///workspace/visible.ts' },
          ],
        },
        {
          activeTabId: 3,
          tabs: [
            { id: 3, uri: 'file:///workspace/other-group.ts' },
            { id: 4, uri: 'search-editor://1/Search' },
          ],
        },
        { activeTabId: 5, tabs: [{ id: 5, label: 'untitled' }] },
      ],
    },
  }))

  await expect(GetActiveEditor.getVisibleEditorUrisWithInvoke(invoke)).resolves.toEqual([
    'file:///workspace/visible.ts',
    'file:///workspace/other-group.ts',
  ])
  expect(invoke).toHaveBeenCalledWith('MainArea.saveState', 1)
})

test('getVisibleEditorUris returns an empty array without a main area', async () => {
  const invoke = jest.fn()
  await expect(GetActiveEditor.getVisibleEditorUrisWithInvoke(invoke)).resolves.toEqual([])
  expect(invoke).not.toHaveBeenCalled()
})

test('getActiveUri returns the selected tab in the active group', async () => {
  ViewletStates.set('Main', {
    factory: {},
    moduleId: 'Main',
    renderedState: { uid: 1 },
    state: { uid: 1 },
  })
  const invoke = jest.fn(async () => ({
    layout: {
      activeGroupId: 2,
      groups: [
        { activeTabId: 3, id: 1, tabs: [{ id: 3, uri: 'file:///workspace/src/app.ts' }] },
        {
          activeTabId: 4,
          id: 2,
          tabs: [
            { id: 4, uri: 'process-explorer://' },
            { id: 5, uri: 'file:///workspace/src/other.ts' },
          ],
        },
      ],
    },
  }))

  await expect(GetActiveEditor.getActiveUriWithInvoke(invoke)).resolves.toBe('process-explorer://')
  expect(invoke).toHaveBeenCalledWith('MainArea.saveState', 1)
})

test('getActiveUri returns an empty string without a main area', async () => {
  const invoke = jest.fn()
  await expect(GetActiveEditor.getActiveUriWithInvoke(invoke)).resolves.toBe('')
  expect(invoke).not.toHaveBeenCalled()
})

test('getTextDocument reads only the requested application even when another editor is focused', async () => {
  for (const [id, applicationId] of [
    [41, 'source'],
    [42, 'preview'],
  ]) {
    ApplicationRegistry.create({ id: applicationId, layoutUid: id + 100, workspaceUri: 'memfs:///', workspacePath: '/', href: '/samples' })
    ViewletStates.set(id, {
      factory: {},
      moduleId: 'EditorText',
      renderedState: { uid: id },
      state: { id, uid: id, applicationId, uri: `memfs:///${applicationId}.js` },
    })
  }
  ViewletStates.setFocusedInstanceByType(42, 'EditorText')
  const invoke = jest.fn(async () => 'debugger')
  await expect(GetActiveEditor.getTextDocumentWithInvoke(invoke, 'source')).resolves.toEqual({ text: 'debugger', uri: 'memfs:///source.js' })
  expect(invoke).toHaveBeenCalledWith('Editor.getText', 41)
  await expect(GetActiveEditor.getTextDocumentWithInvoke(invoke, 'missing')).resolves.toBeUndefined()
})

test('selection reads and writes stay in the requested application', async () => {
  for (const [id, applicationId] of [
    [41, 'source'],
    [42, 'preview'],
  ]) {
    ApplicationRegistry.create({ id: applicationId, layoutUid: id + 100, workspaceUri: 'memfs:///', workspacePath: '/', href: '/samples' })
    ViewletStates.set(id, { factory: {}, moduleId: 'EditorText', renderedState: { uid: id }, state: { id, uid: id, applicationId } })
  }
  ViewletStates.setFocusedInstanceByType(41, 'EditorText')
  const invoke = jest.fn(async () => new Uint32Array([0, 1, 0, 4]))
  await expect(GetActiveEditor.getSelectionsWithInvoke(invoke, 'preview')).resolves.toEqual([0, 1, 0, 4])
  expect(invoke).toHaveBeenCalledWith('Editor.getSelections2', 42)
  await GetActiveEditor.setSelectionsWithCommand(executeCommand, [0, 4, 0, 4], 'preview')
  expect(executeCommand).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'setSelections', new Uint32Array([0, 4, 0, 4]))
  invoke.mockClear()
  executeCommand.mockClear()
  await expect(GetActiveEditor.getSelectionsWithInvoke(invoke, 'missing')).resolves.toEqual([])
  await GetActiveEditor.setSelectionsWithCommand(executeCommand, [0, 0, 0, 0], 'missing')
  expect(invoke).not.toHaveBeenCalled()
  expect(executeCommand).not.toHaveBeenCalled()
})

test('getActiveUri reads the main area owned by the requested application', async () => {
  for (const [uid, applicationId] of [
    [41, 'source'],
    [42, 'preview'],
  ]) {
    ApplicationRegistry.create({ id: applicationId, layoutUid: uid + 100, workspaceUri: 'memfs:///', workspacePath: '/', href: '/samples' })
    ViewletStates.set(uid, {
      factory: {},
      moduleId: 'Main',
      renderedState: { uid },
      state: { uid, applicationId },
    })
  }
  ViewletStates.setFocusedInstanceByType(41, 'Main')
  const invoke = jest.fn(async (_command, uid) => ({
    layout: { activeGroupId: 1, groups: [{ id: 1, activeTabId: 1, tabs: [{ id: 1, uri: `memfs:///${uid}.txt` }] }] },
  }))
  await expect(GetActiveEditor.getActiveUriWithInvoke(invoke, 'preview')).resolves.toBe('memfs:///42.txt')
  expect(invoke).toHaveBeenCalledWith('MainArea.saveState', 42)
})

test('active editor and visible URIs stay within their application while another application is focused', async () => {
  for (const [id, applicationId] of [
    [41, 'source'],
    [42, 'preview'],
  ]) {
    ApplicationRegistry.create({ id: applicationId, layoutUid: id + 100, workspaceUri: 'memfs:///', workspacePath: '/', href: '/samples' })
    ViewletStates.set(id, {
      factory: {},
      moduleId: 'EditorText',
      renderedState: { uid: id },
      state: { id, uid: id, applicationId },
    })
    ViewletStates.set(id + 100, {
      factory: {},
      moduleId: 'Main',
      renderedState: { uid: id + 100 },
      state: { uid: id + 100, applicationId },
    })
  }
  ViewletStates.setFocusedInstanceByType(42, 'EditorText')
  ViewletStates.setFocusedInstanceByType(142, 'Main')
  const invoke = jest.fn(async (_command, uid) => ({
    layout: {
      activeGroupId: 1,
      groups: [
        {
          id: 1,
          activeTabId: 2,
          tabs: [
            { id: 2, uri: `memfs:///${uid}.txt` },
            { id: 3, uri: 'memfs:///hidden.txt' },
          ],
        },
      ],
    },
  }))
  expect(GetActiveEditor.getActiveEditorId('source')).toBe(41)
  expect(GetActiveEditor.getActiveEditorId('missing')).toBe(-1)
  await expect(GetActiveEditor.getVisibleEditorUrisWithInvoke(invoke, 'source')).resolves.toEqual(['memfs:///141.txt'])
  await expect(GetActiveEditor.getActiveUriWithInvoke(invoke, 'source')).resolves.toBe('memfs:///141.txt')
  await expect(GetActiveEditor.getVisibleEditorUrisWithInvoke(invoke, 'missing')).resolves.toEqual([])
})
