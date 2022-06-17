import * as EditorDeleteCharacterLeft from '../src/parts/EditorCommand/EditorCommandDeleteCharacterLeft.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteCharacterLeft', () => {
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
        type: 1,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteCharacterLeft - when line is empty', () => {
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
  expect(
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteCharacterLeft - merge lines', () => {
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
  expect(
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: ['1111122222'],
    cursor: { rowIndex: 0, columnIndex: 5 },
  })
})

test('line below show not disappear', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 3,
  }
  const editor = {
    lines: ['11111', '22222', '33333'],
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
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: ['11111', '2222', '33333'],
    cursor: { rowIndex: 1, columnIndex: 2 },
  })
})

test('line below show not disappear 2', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 5,
  }
  const editor = {
    lines: ['11111', '22222', '33333'],
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
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: ['11111', '2222', '33333'],
    cursor: { rowIndex: 1, columnIndex: 4 },
  })
})

test('editorDeleteCharacterLeft - with selection', () => {
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
  expect(
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    lines: ['lne 2'],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

// TODO test merging multiple lines with multiple cursors/selections

test('editorDeleteCharacterLeft - emoji - 👮🏽‍♀️', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: '👮🏽‍♀️'.length,
  }
  const editor = {
    lines: ['👮🏽‍♀️'],
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
    EditorDeleteCharacterLeft.editorDeleteCharacterLeft(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    lines: [''],
  })
})
