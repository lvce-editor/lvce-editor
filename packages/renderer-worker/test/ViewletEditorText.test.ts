import { beforeEach, expect, jest, test } from '@jest/globals'

const editorWorkerInvoke = jest.fn()
const getTextEditorContent = jest.fn<() => string>()
const getTokenizePath = jest.fn<(languageId: string) => string>()
const layoutWidgetsReconcile = jest.fn<(commands: readonly (readonly any[])[]) => any[]>()
const rendererProcessInvoke = jest.fn()
const tokenizerRemoveConnectedEditor = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
  getTextEditorContent.mockReturnValue('first line\nsecond line')
  getTokenizePath.mockImplementation((languageId: string): string => `/tokenize-${languageId}.js`)
  layoutWidgetsReconcile.mockImplementation((commands) => [...commands])
})

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => {
  return {
    measureTextWidth(text) {
      return text.length * 10
    },
  }
})

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => {
  return {
    invoke: editorWorkerInvoke,
  }
})

jest.unstable_mockModule('../src/parts/GetTextEditorContent/GetTextEditorContent.js', () => ({
  getTextEditorContent,
}))

jest.unstable_mockModule('../src/parts/GetTokenizePath/GetTokenizePath.js', () => ({
  getTokenizePath,
}))

jest.unstable_mockModule('../src/parts/LayoutWidgets/LayoutWidgets.ts', () => ({
  reconcile: layoutWidgetsReconcile,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: rendererProcessInvoke,
}))

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.js', () => ({
  getTokenizer: jest.fn(),
  removeConnectedEditor: tokenizerRemoveConnectedEditor,
}))

const ViewletEditorText = await import('../src/parts/ViewletEditorText/ViewletEditorText.js')
const ViewletEditorTextIpc = await import('../src/parts/ViewletEditorText/ViewletEditorText.ipc.js')
const ViewletEditorTextSaveState = await import('../src/parts/ViewletEditorText/ViewletEditorTextSaveState.js')
const Languages = await import('../src/parts/Languages/Languages.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')

beforeEach(() => {
  delete Preferences.state['editor.cache']
})

test('loadContent - renders before diagnostics are requested by loadContentLater', async () => {
  const initialCommands = [['Viewlet.setDom2']]
  const selectionCommands = [['Viewlet.setPatches']]
  let renderCount = 0
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return renderCount++ === 0 ? initialCommands : selectionCommands
      default:
        return undefined
    }
  })
  const state = ViewletEditorText.create(1, '/test/file.txt', 0, 0, 800, 600)
  const selections = new Uint32Array([1, 2, 1, 8])

  const newState = await ViewletEditorText.loadContent(state, { selections: [0, 0, 0, 0] }, { languageId: 'typescript', selections })

  expect(editorWorkerInvoke).toHaveBeenCalledWith(
    'Editor.create2',
    1,
    '/test/file.txt',
    0,
    0,
    800,
    600,
    expect.any(Number),
    expect.any(String),
    'typescript',
    '/tokenize-typescript.js',
    true,
  )
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.loadContent', 1, undefined)
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.setSelections2', 1, selections)
  const editorMethods = editorWorkerInvoke.mock.calls
    .map(([method]) => method)
    .filter((method): method is string => typeof method === 'string' && method.startsWith('Editor.'))
  expect(editorMethods).toEqual([
    'Editor.create2',
    'Editor.loadContent',
    'Editor.diff2',
    'Editor.render2',
    'Editor.setSelections2',
    'Editor.diff2',
    'Editor.render2',
  ])
  const createCall = editorWorkerInvoke.mock.calls.find(([method]) => method === 'Editor.create2')
  expect(createCall?.at(-1)).toBe(true)
  expect(newState.commands).toEqual([...initialCommands, ...selectionCommands])
})

test('loadContent - restores the editor worker state', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.diff2':
      case 'Editor.render2':
        return []
      default:
        return undefined
    }
  })
  const state = ViewletEditorText.create(1, '/test/file.txt', 0, 0, 800, 600)
  const editorState = {
    lines: ['saved content'],
    redoStack: [['redo']],
    undoStack: [['undo']],
  }

  await ViewletEditorText.loadContent(state, { editorState }, {})

  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.loadContent', 1, editorState)
})

test('saveState - saves editor history under a URI-scoped key', async () => {
  const editorState = {
    lines: ['saved content'],
    redoStack: [['redo']],
    undoStack: [['undo']],
  }
  editorWorkerInvoke.mockResolvedValue(editorState as never)
  const state = {
    ...ViewletEditorText.create(1, 'file:///test/file.txt', 0, 0, 800, 600),
    deltaY: 20,
    focused: true,
    selections: new Uint32Array([1, 2, 1, 4]),
  }

  await expect(ViewletEditorTextSaveState.saveState(state)).resolves.toEqual({
    deltaY: 20,
    editorState,
    focused: true,
    selections: [1, 2, 1, 4],
  })
  expect(ViewletEditorTextSaveState.getStorageKey(state)).toBe('Editor:file:///test/file.txt')
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.saveState', 1)
})

test('loadContent - restores the definition range supplied by the opener', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.diff2':
      case 'Editor.render2':
        return []
      default:
        return undefined
    }
  })
  const state = ViewletEditorText.create(1, '/test/lib.es5.d.ts', 0, 0, 800, 600)

  await ViewletEditorText.loadContent(
    state,
    { selections: [0, 0, 0, 0] },
    {
      endColumnIndex: 9,
      endRowIndex: 592,
      languageId: 'typescript',
      startColumnIndex: 4,
      startRowIndex: 592,
    },
  )

  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.setSelections2', 1, new Uint32Array([592, 4, 592, 9]))
})

test('loadContent - disables the editor file cache through preferences', async () => {
  Preferences.state['editor.cache'] = false
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.diff2':
      case 'Editor.render2':
        return []
      default:
        return undefined
    }
  })
  const state = ViewletEditorText.create(1, '/test/file.txt', 0, 0, 800, 600)

  await ViewletEditorText.loadContent(state, {}, {})

  const createCall = editorWorkerInvoke.mock.calls.find(([method]) => method === 'Editor.create2')
  expect(createCall?.at(-1)).toBe(false)
})

test('loadContent - detects the language from the first line for an extensionless file', async () => {
  Languages.addLanguage({
    id: 'javascript',
    firstLine: '^#!.*\\bnode',
  })
  getTextEditorContent.mockReturnValue('#!/usr/bin/env node\n"use strict"')
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.diff2':
      case 'Editor.render2':
        return []
      default:
        return undefined
    }
  })
  const state = ViewletEditorText.create(1, '/test/acorn', 0, 0, 800, 600)

  await ViewletEditorText.loadContent(state, {}, {})

  expect(editorWorkerInvoke).toHaveBeenCalledWith(
    'Editor.create2',
    1,
    '/test/acorn',
    0,
    0,
    800,
    600,
    expect.any(Number),
    expect.any(String),
    'javascript',
    '/tokenize-javascript.js',
    true,
  )
})

test('dispose', async () => {
  const commands = [
    ['Viewlet.setWidgets', 1, 2, []],
    ['Viewlet.dispose', 2],
  ]
  const reconciledCommands = [['Viewlet.dispose', 2]]
  editorWorkerInvoke.mockImplementation(() => commands)
  layoutWidgetsReconcile.mockReturnValue(reconciledCommands)

  await ViewletEditorText.dispose({ id: 1 })

  expect(tokenizerRemoveConnectedEditor).toHaveBeenCalledWith(1)
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.dispose', 1)
  expect(layoutWidgetsReconcile).toHaveBeenCalledWith(commands)
  expect(rendererProcessInvoke).toHaveBeenCalledWith('Viewlet.sendMultiple', reconciledCommands)
})

test('handleSettingsChanged updates and rerenders the editor worker', async () => {
  const commands = [['Viewlet.renderCanvas', '.EditorMinimap', 'EditorMinimapCanvas', 1, []]]
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.handleSettingsChanged':
        return undefined
      case 'Editor.diff2':
        return [1]
      case 'Editor.render2':
        return commands
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = ViewletEditorText.create(1, '/test/file.txt', 0, 0, 800, 600)

  const newState = await ViewletEditorText.handleSettingsChanged(state)

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.handleSettingsChanged', 1)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.diff2', 1)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.render2', 1, [1])
  expect(newState.commands).toEqual(commands)
  expect(ViewletEditorTextIpc.Events['preferences.changed']).toBe(ViewletEditorText.handleSettingsChanged)
})

test('resize - increase height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return [1]
      case 'Editor.render2':
        return [['setRows']]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 1,
    numberOfVisibleLines: 1,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 36,
      finalDeltaY: 40,
    }),
  )
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.resize', 0, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.diff2', 0)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.render2', 0, [1])
  expect(newState.commands).toEqual([['setRows']])
})

test('resize - same height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 36,
      finalDeltaY: 40,
    }),
  )
})

test('resize - reduce height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
    height: 60,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 20,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 1,
      numberOfVisibleLines: 1,
      scrollBarHeight: 20,
      finalDeltaY: 80,
    }),
  )
})

test('resize - increase height while scrolled clamps visible rows to bottom', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 100, 200),
    deltaY: 1800,
    finalDeltaY: 1800,
    finalY: 90,
    lines: Array.from({ length: 100 }, (_, index) => `line ${index}`),
    minLineY: 90,
    maxLineY: 100,
    numberOfVisibleLines: 10,
    scrollBarHeight: 20,
    focused: true,
    width: 100,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 0,
    y: 0,
    width: 100,
    height: 400,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      deltaY: 1600,
      finalDeltaY: 1600,
      minLineY: 80,
      maxLineY: 100,
      numberOfVisibleLines: 20,
      scrollBarHeight: 80,
    }),
  )
})

test('component state reads editor-worker internals and renders JSON edits', async () => {
  const state = ViewletEditorText.create(7, '/test/file.txt', 0, 0, 800, 600)
  const componentState = { uid: 7, lines: ['worker text'], selections: [0, 0, 0, 0] }
  const editedState = { ...componentState, lines: ['edited text'] }
  const commands = [['Viewlet.setPatches', 7, []]]
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getComponentState':
        return componentState
      case 'Editor.diff2':
        return [1]
      case 'Editor.render2':
        return commands
      default:
        return undefined
    }
  })

  expect(await ViewletEditorTextIpc.getComponentState(state)).toBe(componentState)
  const updated = await ViewletEditorTextIpc.setComponentState(state, editedState)

  expect(editorWorkerInvoke.mock.calls).toEqual([
    ['Editor.getComponentState', 7],
    ['Editor.setComponentState', 7, editedState],
    ['Editor.diff2', 7],
    ['Editor.render2', 7, [1]],
  ])
  expect(updated).toEqual({ ...state, commands })
})
