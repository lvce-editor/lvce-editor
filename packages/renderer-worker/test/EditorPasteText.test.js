import * as EditorPasteText from '../src/parts/EditorCommand/EditorCommandPasteText.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorPasteText', () => {
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
  expect(EditorPasteText.editorPasteText(editor, 'line 1')).toMatchObject({
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 6,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
  })
})

test.skip('editorPasteText - middle of line', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 1,
  }
  const editor = {
    lines: ['aaa', 'bbb', 'ccc'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorPasteText.editorPasteText(
      editor,
      ` 111
222 `
    )
  ).toMatchObject({
    lines: ['aaa', 'b 111', '222 bb', 'ccc'],
    cursor: {
      rowIndex: 2,
      columnIndex: 4,
    },
    selections: [],
  })
})

test('editorPasteText - issue with pasting multiple lines', () => {
  const editor = {
    uri: '/tmp/foo-ScUYJ4/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
    completionTriggerCharacters: [],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 3,
          columnIndex: 6,
        },
      },
    ],
    id: 1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    top: 55,
    left: 0,
    undoStack: [],
    validLines: [],
    invalidStartIndex: 3,
  }
  expect(
    EditorPasteText.editorPasteText(
      editor,
      `line 1
line 2
line 3`
    )
  ).toMatchObject({
    lines: ['line 1', 'line 2', 'line 3'],
  })
})
