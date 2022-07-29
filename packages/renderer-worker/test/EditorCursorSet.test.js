import * as EditorCursorSet from '../src/parts/EditorCommand/EditorCommandCursorSet.js'

test('editorCursorSet - invalid argument - array', () => {
  const editor = {}
  expect(() =>
    EditorCursorSet.editorCursorSet(editor, [{ rowIndex: 0, columnIndex: 1 }])
  ).toThrowError(new Error('expected value to be of type object'))
})
