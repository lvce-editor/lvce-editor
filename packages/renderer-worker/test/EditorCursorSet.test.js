import * as EditorCursorSet from '../src/parts/EditorCommand/EditorCommandCursorSet.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorSet - invalid argument - array', () => {
  const editor = {}
  expect(() => EditorCursorSet.cursorSet(editor, [0, 1])).toThrow(new Error('expected value to be of type number'))
})

test('editorCursorSet', () => {
  const editor = {}
  expect(EditorCursorSet.cursorSet(editor, 0, 1)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})
