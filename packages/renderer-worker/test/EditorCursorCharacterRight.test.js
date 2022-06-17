import * as EditorCursorCharacterRight from '../src/parts/EditorCommand/EditorCommandCursorCharacterRight.js'

test('editorCursorCharacterRight', () => {
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
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test('editorCursorCharacterRight - with selection', () => {
  const editor = {
    lines: ['abc'],
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
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
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

test('editorCursorCharacterRight - at end of line', () => {
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
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorCursorCharacterRight - emoji - 👮🏽‍♀️', () => {
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
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test('editorCursorCharacterRight - unicode - zero width space', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['\u200B'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorCursorCharacterRight.editorCursorsCharacterRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})
