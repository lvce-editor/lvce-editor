import * as EditorHandleDoubleClick from '../src/parts/EditorCommand/EditorCommandHandleDoubleClick.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorHandleDoubleClick - with selection', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
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
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  expect(
    EditorHandleDoubleClick.editorHandleDoubleClick(editor, 21, 11, 4)
  ).toMatchObject({
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
    ],
  })
})

test.skip('editorHandleDoubleClick - no word to select', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['11111    22222'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  // TODO should select whitespace
  expect(
    EditorHandleDoubleClick.editorHandleDoubleClick(editor, 68, 11)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [],
  })
})
