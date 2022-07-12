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

test('editorType', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.editorType(editor, 'a')).toMatchObject({
    lines: ['a'],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorType - with selection', async () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 1,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 2,
        },
      },
    ],
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.editorType(editor, 'a')).toMatchObject({
    lines: ['lane 2'],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
  })
})

test('editorType - emoji 👮🏽‍♀️', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorType.editorType(editor, '👮🏽‍♀️')).toMatchObject({
    lines: ['👮🏽‍♀️'],
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test.skip('editorType - braceCompletion - opening curly brace', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return true
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.editorType(editor, '{')).toMatchObject({
    lines: ['{}'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
})

test.skip('editorType - braceCompletion - opening round brace', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return true
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.editorType(editor, '(')).toMatchObject({
    lines: ['()'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
})

test.skip('editorType - braceCompletion - opening square brace', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await EditorType.editorType(editor, '[')).toMatchObject({
    lines: ['[]'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
})
