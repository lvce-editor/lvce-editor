import { expect, test } from '@jest/globals'
import * as EditorCursorWordRight from '../src/parts/EditorCommand/EditorCommandCursorWordRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test.skip('editorCursorWordRight', () => {
  const editor = {
    lines: ['    <title>Document</title>'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  })
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 11, 0, 11),
  })
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 19, 0, 19),
  })
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 26, 0, 26),
  })
  EditorCursorWordRight.cursorWordRight(editor)
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
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 9, 0, 9),
  })
  EditorCursorWordRight.cursorWordRight(editor)
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
  EditorCursorWordRight.cursorWordRight(editor)
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
  EditorCursorWordRight.cursorWordRight(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
