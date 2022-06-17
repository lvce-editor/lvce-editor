import * as EditorCursorUp from '../src/parts/EditorCommand/EditorCommandCursorUp.js'

test('editorCursorUp - at start of file', () => {
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
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorUp - one line below top', () => {
  const cursor = {
    rowIndex: 1,
    columnIndex: 0,
  }
  const editor = {
    lines: ['', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorUp - with selection', () => {
  const editor = {
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
      },
    ],
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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
    ],
  })
})

test('editorCursorUp - with emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['abc', '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️'],
    cursor: {
      rowIndex: 1,
      columnIndex: 21,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 21,
        },
        end: {
          rowIndex: 1,
          columnIndex: 21,
        },
      },
    ],
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 3,
        },
        end: {
          rowIndex: 0,
          columnIndex: 3,
        },
      },
    ],
  })
})

test('editorCursorUp - line above is shorter', () => {
  const editor = {
    lines: ['a', 'abcd'],
    cursor: {
      rowIndex: 1,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 4,
        },
        end: {
          rowIndex: 1,
          columnIndex: 4,
        },
      },
    ],
  }
  expect(EditorCursorUp.editorCursorsUp(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1, // TODO with virtual space, this would be 4
    },
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
  })
})
