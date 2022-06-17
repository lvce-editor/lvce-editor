import * as EditorDeleteCharacterRight from '../src/parts/EditorCommand/EditorCommandDeleteCharacterRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorDeleteCharacterRight', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
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
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteCharacterRight - with selection', () => {
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
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
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

test('editorDeleteCharacterRight - empty line', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['', 'next line'],
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
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['next line'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorDeleteCharacterRight - merge lines', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 6,
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
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['line 1line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorDeleteCharacterRight - emoji - 👮🏽‍♀️', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
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
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    lines: [''],
  })
})

test('editorDeleteCharacterRight - multiple words', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
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
  expect(
    EditorDeleteCharacterRight.editorDeleteCharacterRight(editor)
  ).toMatchObject({
    lines: ['sampl text'],
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
})
