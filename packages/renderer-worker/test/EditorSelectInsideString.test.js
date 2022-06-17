import * as EditorSelectInsideString from '../src/parts/EditorCommand/EditorCommandSelectInsideString.js'

test('editorSelectInsideString', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['"line 1"', '"line 2"'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(
    EditorSelectInsideString.editorSelectInsideString(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 0,
          columnIndex: 7,
        },
      },
    ],
  })
})
