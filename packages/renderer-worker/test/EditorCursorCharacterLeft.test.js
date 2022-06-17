import * as EditorCursorLeft from '../src/parts/EditorCommand/EditorCommandCursorCharacterLeft.js'

test('editorCursorCharacterLeft - at start', () => {
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
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorCharacterLeft - one after start of line', () => {
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
      },
    ],
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorCharacterLeft - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
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

  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
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

test('editorCursorCharacterLeft - at start of line', () => {
  const cursor = {
    rowIndex: 1,
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
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorCursorCharacterLeft - emoji - 👮🏽‍♀️', () => {
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
  }
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorCharacterLeft - unicode - zero width space', () => {
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
  expect(EditorCursorLeft.editorCursorCharacterLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})
