import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCore.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const EditorType = await import(
  '../src/parts/EditorCommand/EditorCommandType.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ExtensionHostBraceCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostBraceCompletion.js'
)

const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

const EditorSelection = await import(
  '../src/parts/EditorSelection/EditorSelection.js'
)

test('editorType', async () => {
  const editor = {
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.type(editor, 'a')).toMatchObject({
    lines: ['a'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})

test('editorType - with selection', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 1, 1, 2),
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.type(editor, 'a')).toMatchObject({
    lines: ['lane 2'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test('editorType - emoji 👮🏽‍♀️', async () => {
  const editor = {
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.type(editor, '👮🏽‍♀️')).toMatchObject({
    lines: ['👮🏽‍♀️'],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test.skip('editorType - braceCompletion - opening curly brace', async () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return true
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.type(editor, '{')).toMatchObject({
    lines: ['{}'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test.skip('editorType - braceCompletion - opening round brace', async () => {
  const editor = {
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return true
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.type(editor, '(')).toMatchObject({
    lines: ['()'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})

test.skip('editorType - braceCompletion - opening square brace', async () => {
  const editor = {
    lines: [''],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...parameters) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.type(editor, '[')).toMatchObject({
    lines: ['[]'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})
