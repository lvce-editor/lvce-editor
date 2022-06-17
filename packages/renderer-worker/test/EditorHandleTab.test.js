import * as EditorHandleTab from '../src/parts/EditorCommand/EditorCommandHandleTab.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as Languages from '../src/parts/Languages/Languages.js'

test('editorHandleTab - no tab completion available', async () => {
  Languages.state.loaded = true
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['a'],
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
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 386:
        SharedProcess.state.receive({
          id: message.id,
          result: null,
        })
        break
      case 385:
        break
      case 'ExtensionHost.executeTabCompletionProvider':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: null,
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
      case 'ExtensionManagement.getExtensions':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['a  '],
  })
})

test.skip('editorHandleTab - tab completion available', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['a'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 386:
        SharedProcess.state.receive({
          id: message.id,
          result: {
            inserted: 'bc',
            deleted: 1,
            type: /* Snippet */ 2,
          },
        })
        break
      case 385:
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['bc'],
  })
})

test('editorHandleTab - indent one selection - single line', async () => {
  const editor = {
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['  '],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
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

test.skip('editorHandleTab - indent one selection - multiple lines', async () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
    tokenizer: TokenizePlainText,
  }
  expect(await EditorHandleTab.editorHandleTab(editor)).toMatchObject({
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 3,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 4,
    },
  })
})
