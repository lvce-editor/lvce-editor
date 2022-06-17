import * as EditorTabCompletion from '../src/parts/EditorCommand/EditorCommandTabCompletion.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as Languages from '../src/parts/Languages/Languages.js'

test('editorTabCompletion - no tab completion available', async () => {
  Languages.state.loaded = true
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['a'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
  }
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 'ExtensionHost.executeTabCompletionProvider':
        SharedProcess.state.receive({
          id: message.id,
          result: null,
        })
        break
      case 385:
        break
      case 'ExtensionHostTextDocument.syncIncremental':
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
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toBe(editor)
})

test('editorTabCompletion - tab completion available', async () => {
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
    tokenizer: TokenizePlainText,
    lineCache: [],
    undoStack: [],
  }
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 'ExtensionHost.executeTabCompletionProvider':
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
      case 'ExtensionHostTextDocument.syncIncremental':
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
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toMatchObject({
    lines: ['bc'],
  })
})

// TODO test multiline snippet

test('editorTabCompletion - multiline snippet', async () => {
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
    tokenizer: TokenizePlainText,
    lineCache: [],
    minLineY: 0,
    maxLineY: 1,
    deltaY: 0,
    invalidStartIndex: 0,
    height: 200,
    numberOfVisibleLines: 10,
    rowHeight: 20,
    columnWidth: 8,
    scrollBarHeight: 10,
    undoStack: [],
  }
  SharedProcess.state.send = (message) => {
    switch (message.method) {
      case 'ExtensionHost.executeTabCompletionProvider':
        SharedProcess.state.receive({
          id: message.id,
          result: {
            inserted: `<div>
  $0
</div>`,
            deleted: 1,
            type: /* Snippet */ 2,
          },
        })
        break
      case 385:
        break
      case 'ExtensionHostTextDocument.syncIncremental':
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
  expect(await EditorTabCompletion.editorTabCompletion(editor)).toMatchObject({
    lines: ['<div>', '  $0', '</div>'],
  })
})
