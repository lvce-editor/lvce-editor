import * as EditorDeleteWordLeft from '../src/parts/EditorCommand/EditorCommandDeleteWordLeft.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteWordLeft', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 11,
  }
  const editor = {
    lines: ['sample text'],
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
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['sample '],
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test('editorDeleteWordLeft - merge lines', () => {
  const cursor = {
    rowIndex: 1,
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
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['1111122222'],
    cursor: { rowIndex: 0, columnIndex: 5 },
  })
})

test.skip('editorDeleteWordLeft - no word left', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['1   '],
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
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorDeleteWordLeft - at start of line', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 0,
  }
  const editor = {
    lines: ['1', '2'],
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
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['12'],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorDeleteWordLeft - at start of file', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['1', '2'],
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
  expect(EditorDeleteWordLeft.editorDeleteWordLeft(editor)).toMatchObject({
    lines: ['1', '2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})
