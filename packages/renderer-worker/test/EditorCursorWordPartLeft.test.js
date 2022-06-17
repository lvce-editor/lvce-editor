import * as EditorCursorWordPartLeft from '../src/parts/EditorCommand/EditorCommandCursorWordPartLeft.js'

test('editorCursorWordPartLeft - camelCase', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 6,
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
  const moved1 = EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
  const moved2 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorWordPartLeft - snake case', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 7,
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
  const moved1 = EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
  const moved2 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorWordPartLeft - foo1Bar', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 7,
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
  const moved1 = EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
  const moved2 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorWordPartLeft - at start of line', () => {
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
  expect(
    EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
  })
})

test('editorCursorWordPartLeft - multiple capital letters', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 15,
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
  const moved1 = EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
  const moved2 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
  const moved3 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved2)
  expect(moved3).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
  const moved4 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved3)
  expect(moved4).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
  const moved5 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved4)
  expect(moved5).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

// TODO test multiple numbers

test('editorCursorWordPartLeft - multiple underscores', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
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
  const moved1 = EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
  const moved2 = EditorCursorWordPartLeft.editorCursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test('editorCursorWordPartLeft - jump over whitespace', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 6,
  }
  const editor = {
    lines: ['A1323 '],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test.skip('editorCursorWordPartLeft - jump over punctuation', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 10,
  }
  const editor = {
    lines: ['Aa|||----B'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  RendererProcess.state.send = jest.fn()
  EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 9,
  })
  EditorCursorWordPartLeft.editorCursorWordPartLeft(editor)
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 2,
  })
})
