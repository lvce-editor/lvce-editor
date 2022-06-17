import * as EditorInsertLineBreak from '../src/parts/EditorCommand/EditorCommandInsertLineBreak.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorInsertLineBreak', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['11111', '22222'],
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
  expect(EditorInsertLineBreak.editorInsertLineBreak(editor)).toMatchObject({
    lines: ['', '11111', '22222'],
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorInsertLineBreak - in middle', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 2,
  }
  const editor = {
    lines: ['11111', '22222'],
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
  expect(EditorInsertLineBreak.editorInsertLineBreak(editor)).toMatchObject({
    lines: ['11', '111', '22222'],
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorInsertLineBreak - with whitespace at start', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 2,
  }
  const editor = {
    lines: ['    11111', '22222'],
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
  expect(EditorInsertLineBreak.editorInsertLineBreak(editor)).toMatchObject({
    lines: ['  ', '    11111', '22222'],
    cursor: {
      rowIndex: 1,
      columnIndex: 2,
    },
  })
})

test('editorInsertLineBreak - with selection', () => {
  const editor = {
    lines: ['11111', '22222'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorInsertLineBreak.editorInsertLineBreak(editor)).toMatchObject({
    lines: ['', '111', '22222'],
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorInsertLineBreak - cursor at end of line', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 9,
  }
  const editor = {
    lines: ['    11111', '22222'],
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
  expect(EditorInsertLineBreak.editorInsertLineBreak(editor)).toMatchObject({
    lines: ['    11111', '    ', '22222'],
    cursor: {
      rowIndex: 1,
      columnIndex: 4,
    },
  })
})
