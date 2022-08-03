import * as EditorCursorSet from '../src/parts/EditorCommandCursorSet/EditorCommandCursorSet.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorSet - invalid argument - array', () => {
  const editor = {}
  expect(() => EditorCursorSet.editorCursorSet(editor, [0, 1])).toThrowError(
    new Error('expected value to be of type number')
  )
})

test('editorCursorSet', () => {
  const editor = {}
  expect(EditorCursorSet.editorCursorSet(editor, 0, 1)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
})
