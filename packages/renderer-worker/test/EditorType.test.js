import * as EditorType from '../src/parts/EditorCommand/EditorCommandType.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import { jest } from '@jest/globals'
import * as Languages from '../src/parts/Languages/Languages.js'

beforeAll(() => {
  Languages.state.loaded = true
})

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
    tokenizer: TokenizePlainText,
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
    tokenizer: TokenizePlainText,
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
    tokenizer: TokenizePlainText,
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

test('editorType - braceCompletion - opening curly brace', async () => {
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
    tokenizer: TokenizePlainText,
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: true,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
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

test('editorType - braceCompletion - opening round brace', async () => {
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
    tokenizer: TokenizePlainText,
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: true,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
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

test('editorType - braceCompletion - opening square brace', async () => {
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
    tokenizer: TokenizePlainText,
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 242:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
      case 'ExtensionHost.start':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHost.setWorkspaceRoot':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
        })
        break
      case 'ExtensionHostBraceCompletion.executeBraceCompletionProvider':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: true,
        })
        break
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
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
