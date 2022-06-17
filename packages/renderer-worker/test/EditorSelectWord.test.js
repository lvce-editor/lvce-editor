import * as EditorSelectWord from '../src/parts/EditorCommand/EditorCommandSelectWord.js'

test('editorSelectWord', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
  }
  const editor = {
    lines: ['abcde', 'abcde'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
  })
})

test('editorSelectWord - with numbers', () => {
  const editor = {
    lines: ['11111', '22222'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },

    selections: [],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
  })
})

test('editorSelectWord - with umlaut', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['füße'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
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

test('editorSelectWord - with accent', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['tàste'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
  })
})

test('editorSelectWord - with word before', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 3,
  }
  const editor = {
    lines: ['abc   '],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 3,
        },
      },
    ],
  })
})

test('editorSelectWord - with word after', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 3,
  }
  const editor = {
    lines: ['   def'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectWord.editorSelectWord(
      editor,
      editor.cursor.rowIndex,
      editor.cursor.columnIndex
    )
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 3,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
  })
})
