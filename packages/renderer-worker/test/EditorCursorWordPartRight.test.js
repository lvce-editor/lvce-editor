import * as EditorCursorWordPartRight from '../src/parts/EditorCommand/EditorCommandCursorWordPartRight.js'

test('editorCursorWordPartRight - camelCase', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['fooBar'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorCursorWordPartRight - snake case', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['foo_bar'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test('editorCursorWordPartRight - foo1Bar', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['foo1Bar'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
})

test('editorCursorWordPartRight - at end of line', () => {
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
    EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 1,
      columnIndex: 0,
    },
  })
})

test('editorCursorWordPartRight - multiple capital letters', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['X-UA-Compatible'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
  const moved4 = EditorCursorWordPartRight.editorCursorWordPartRight(moved3)
  expect(moved4).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
  const moved5 = EditorCursorWordPartRight.editorCursorWordPartRight(moved4)
  expect(moved5).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 15,
    },
  })
})

// TODO test multiple numbers

// TODO test emojis/special characters

test('editorCursorWordPartRight - jump over whitespace', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [' A1323'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorCursorWordPartRight - multiple underscores', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['A__B'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
})

test('editorCursorWordPartRight - uppercase word', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['REMOTE_PREFIX'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 7,
    },
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 13,
    },
  })
})
