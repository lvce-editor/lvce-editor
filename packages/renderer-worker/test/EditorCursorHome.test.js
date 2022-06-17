import * as EditorCursorHome from '../src/parts/EditorCommand/EditorCommandCursorHome.js'

test('editorCursorHome', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['aaaaa'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorHome - with indent', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 6,
  }
  const editor = {
    lines: ['  aaaaa'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
})

test('editorCursorHome - with selection', () => {
  const editor = {
    lines: ['aaaaa'],
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
  }
  expect(EditorCursorHome.editorCursorsHome(editor)).toMatchObject({
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
