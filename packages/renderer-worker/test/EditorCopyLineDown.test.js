import * as EditorCopyLineDown from '../src/parts/EditorCommand/EditorCommandCopyLineDown.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorCopyLineDown - cursor at start of line', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selection: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorCopyLineDown.editorCopyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorCopyLineDown - cursor in middle of line', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 3,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selection: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorCopyLineDown.editorCopyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})
