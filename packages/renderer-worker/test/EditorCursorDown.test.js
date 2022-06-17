import * as EditorCursorDown from '../src/parts/EditorCommand/EditorCommandCursorDown.js'

test('editorCursorDown', () => {
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
  }
  expect(EditorCursorDown.editorCursorsDown(editor)).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorCursorDown - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 1,
          columnIndex: 1,
        },
      },
    ],
  }
  expect(EditorCursorDown.editorCursorsDown(editor)).toMatchObject({
    cursor: {
      rowIndex: 2,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 2,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 1,
        },
      },
    ],
  })
})

test('editorCursorDown - with emoji - 👮🏽‍♀️', () => {
  const editor = {
    lines: ['👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️', 'abc'],
    cursor: {
      rowIndex: 0,
      columnIndex: 21,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 21,
        },
        end: {
          rowIndex: 0,
          columnIndex: 21,
        },
      },
    ],
  }
  expect(EditorCursorDown.editorCursorsDown(editor)).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 3,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 3,
        },
        end: {
          rowIndex: 1,
          columnIndex: 3,
        },
      },
    ],
  })
})

test('editorCursorDown - line below is shorter', () => {
  const editor = {
    lines: ['abcd', 'a'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 4,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
    ],
  }
  expect(EditorCursorDown.editorCursorsDown(editor)).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 1, // TODO with virtual space, this would be 4
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 1,
        },
      },
    ],
  })
})
