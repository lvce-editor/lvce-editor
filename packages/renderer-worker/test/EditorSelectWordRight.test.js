import * as EditorSelectWordRight from '../src/parts/EditorCommand/EditorCommandSelectWordRight.js'

test('editorSelectWordRight', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorSelectWordRight.editorSelectWordRight(editor)).toMatchObject({
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
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
})

test('editorSelectWordRight - with umlaut', () => {
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
  expect(EditorSelectWordRight.editorSelectWordRight(editor)).toMatchObject({
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
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
  })
})

test('editorSelectWordRight - with accent', () => {
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
  expect(EditorSelectWordRight.editorSelectWordRight(editor)).toMatchObject({
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
