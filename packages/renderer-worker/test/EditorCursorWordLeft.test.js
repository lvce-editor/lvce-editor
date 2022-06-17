import * as EditorCursorWordLeft from '../src/parts/EditorCommand/EditorCommandCursorWordLeft.js'

test.skip('editorCursorWordLeft', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 27,
  }
  const editor = {
    lines: ['    <title>Document</title>'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordLeft.editorCursorWordLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 21,
    },
  })
  const moved2 = EditorCursorWordLeft.editorCursorWordLeft(moved1)
  expect(moved2).toMatchObject({
    rowIndex: 0,
    columnIndex: 19,
  })
  const moved3 = EditorCursorWordLeft.editorCursorWordLeft(moved2)
  expect(moved3).toMatchObject({
    rowIndex: 0,
    columnIndex: 11,
  })
  const moved4 = EditorCursorWordLeft.editorCursorWordLeft(moved3)
  expect(moved4).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
  const moved5 = EditorCursorWordLeft.editorCursorWordLeft(moved4)
  expect(moved5).toMatchObject({
    rowIndex: 0,
    columnIndex: 4,
  })
})

test('editorCursorWordLeft - with dots', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 14,
  }
  const editor = {
    lines: ['this.is.a.test'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const moved1 = EditorCursorWordLeft.editorCursorWordLeft(editor)
  expect(moved1).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 10,
    },
  })
  const moved2 = EditorCursorWordLeft.editorCursorWordLeft(moved1)
  expect(moved2).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 8,
    },
  })
  const moved3 = EditorCursorWordLeft.editorCursorWordLeft(moved2)
  expect(moved3).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
  })
  const moved4 = EditorCursorWordLeft.editorCursorWordLeft(moved3)
  expect(moved4).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test.skip('editorCursorWordLeft - with selection', () => {
  const lines = ['<title>Document</title>']
  const editor = {
    lines,
    cursor: {
      rowIndex: 0,
      columnIndex: 23,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 20,
        },
        end: {
          rowIndex: 0,
          columnIndex: 23,
        },
      },
    ],
  }
  expect(EditorCursorWordLeft.editorCursorWordLeft(editor)).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 17,
    },
    selections: [],
  })
})
