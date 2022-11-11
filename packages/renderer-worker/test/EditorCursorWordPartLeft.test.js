import * as EditorCursorWordPartLeft from '../src/parts/EditorCommand/EditorCommandCursorWordPartLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorWordPartLeft - camelCase', () => {
  const editor = {
    lines: ['fooBar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  const moved1 = EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
  const moved2 = EditorCursorWordPartLeft.cursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorWordPartLeft - snake case', () => {
  const editor = {
    lines: ['foo_bar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  }
  const moved1 = EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const moved2 = EditorCursorWordPartLeft.cursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorWordPartLeft - foo1Bar', () => {
  const editor = {
    lines: ['foo1Bar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  }
  const moved1 = EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const moved2 = EditorCursorWordPartLeft.cursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorWordPartLeft - at start of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  }
  expect(EditorCursorWordPartLeft.cursorWordPartLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorWordPartLeft - multiple capital letters', () => {
  const editor = {
    lines: ['X-UA-Compatible'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 15, 0, 15),
  }
  const moved1 = EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
  const moved2 = EditorCursorWordPartLeft.cursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const moved3 = EditorCursorWordPartLeft.cursorWordPartLeft(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
  const moved4 = EditorCursorWordPartLeft.cursorWordPartLeft(moved3)
  expect(moved4).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
  const moved5 = EditorCursorWordPartLeft.cursorWordPartLeft(moved4)
  expect(moved5).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

// TODO test multiple numbers

test('editorCursorWordPartLeft - multiple underscores', () => {
  const editor = {
    lines: ['A__B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  const moved1 = EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
  const moved2 = EditorCursorWordPartLeft.cursorWordPartLeft(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorCursorWordPartLeft - jump over whitespace', () => {
  const editor = {
    lines: ['A1323 '],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(EditorCursorWordPartLeft.cursorWordPartLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test.skip('editorCursorWordPartLeft - jump over punctuation', () => {
  const editor = {
    lines: ['Aa|||----B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  }
  EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 9, 0, 9),
  })
  EditorCursorWordPartLeft.cursorWordPartLeft(editor)
  expect(editor).toMatchObject({
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
})
