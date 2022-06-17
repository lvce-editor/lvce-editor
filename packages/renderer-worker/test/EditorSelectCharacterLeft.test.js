import * as EditorSelectCharacterLeft from '../src/parts/EditorCommand/EditorCommandSelectCharacterLeft.js'

test('editorSelectCharacterLeft', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
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
  expect(
    EditorSelectCharacterLeft.editorSelectCharacterLeft(editor)
  ).toMatchObject({
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
    cursor: {
      rowIndex: 0,
      columnIndex: 1, // TODO should be 0
    },
  })
})

test('editorSelectCharacterLeft - at start of file', () => {
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
  expect(
    EditorSelectCharacterLeft.editorSelectCharacterLeft(editor)
  ).toMatchObject({
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
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})
