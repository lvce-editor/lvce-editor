import * as EditorDeleteHorizontalLeft from '../src/parts/EditorCommand/EditorCommandDeleteHorizontalLeft.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteCharacterHorizontalLeft - single character - no selection', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['line 1', 'line 2'],
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
  expect(
    EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)
  ).toMatchObject({
    lines: ['ine 1', 'line 2'],
    selections: [
      {
        end: {
          columnIndex: 0,
          rowIndex: 0,
        },
        start: {
          columnIndex: 0,
          rowIndex: 0,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteCharacterHorizontalLeft - multiple selections', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 1,
          columnIndex: 4,
        },
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(
    EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, () => 1)
  ).toMatchObject({
    lines: [' 1', ' 2'],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 1,
          columnIndex: 0,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

// TODO test merging multiple lines with multiple cursors/selections
