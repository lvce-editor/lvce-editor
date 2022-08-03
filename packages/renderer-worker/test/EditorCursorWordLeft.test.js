import * as EditorCursorWordLeft from '../src/parts/EditorCommandCursorWordLeft/EditorCommandCursorWordLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test.skip('editorCursorWordLeft', () => {
  const editor = {
    lines: ['    <title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 27, 0, 27),
  }
  const moved1 = EditorCursorWordLeft.editorCursorWordLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 21, 0, 21),
  })
  const moved2 = EditorCursorWordLeft.editorCursorWordLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 19, 0, 19),
  })
  const moved3 = EditorCursorWordLeft.editorCursorWordLeft(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 11, 0, 11),
  })
  const moved4 = EditorCursorWordLeft.editorCursorWordLeft(moved3)
  expect(moved4).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
  const moved5 = EditorCursorWordLeft.editorCursorWordLeft(moved4)
  expect(moved5).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})

test('editorCursorWordLeft - with dots', () => {
  const editor = {
    lines: ['this.is.a.test'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 14, 0, 14),
  }
  const moved1 = EditorCursorWordLeft.editorCursorWordLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  })
  const moved2 = EditorCursorWordLeft.editorCursorWordLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 8, 0, 8),
  })
  const moved3 = EditorCursorWordLeft.editorCursorWordLeft(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
  const moved4 = EditorCursorWordLeft.editorCursorWordLeft(moved3)
  expect(moved4).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorCursorWordLeft - with selection', () => {
  const lines = ['<title>Document</title>']
  const editor = {
    lines,
    selections: EditorSelection.fromRange(0, 20, 0, 23),
  }
  expect(EditorCursorWordLeft.editorCursorWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 17, 0, 17),
  })
})
