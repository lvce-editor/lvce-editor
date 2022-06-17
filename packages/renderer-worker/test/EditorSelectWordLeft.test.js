import * as EditorSelectWordLeft from '../src/parts/EditorCommand/EditorCommandSelectWordLeft.js'

test('editorSelectWordLeft', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
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
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
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

test('editorSelectWordLeft - with umlaut', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
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
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
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

test('editorSelectWordLeft - with accent', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 5,
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
  expect(EditorSelectWordLeft.editorSelectWordLeft(editor)).toMatchObject({
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
