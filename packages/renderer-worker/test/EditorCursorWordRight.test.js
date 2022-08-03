import * as EditorCursorWordRight from '../src/parts/EditorCommandCursorWordRight/EditorCommandCursorWordRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test.skip('editorCursorWordRight', () => {
  const editor = {
    lines: ['    <title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 11, 0, 11),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 19, 0, 19),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 26, 0, 26),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 27, 0, 27),
  })
})

test.skip('editorCursorWordRight - with dots', () => {
  const editor = {
    lines: ['this.is.a.test'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 9, 0, 9),
  })
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 14, 0, 14),
  })
})

test.skip('editorCursorWordRight - with selection', () => {
  const editor = {
    lines: ['<title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  }
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test.skip('editorCursorWordRight - at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  EditorCursorWordRight.editorCursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
