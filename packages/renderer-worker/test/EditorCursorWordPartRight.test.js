import * as EditorCursorWordPartRight from '../src/parts/EditorCursorWordPartRight/EditorCommandCursorWordPartRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCursorWordPartRight - camelCase', () => {
  const editor = {
    lines: ['fooBar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorWordPartRight - snake case', () => {
  const editor = {
    lines: ['foo_bar'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorCursorWordPartRight - foo1Bar', () => {
  const editor = {
    lines: ['foo1Bar'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test('editorCursorWordPartRight - at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(
    EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCursorWordPartRight - multiple capital letters', () => {
  const editor = {
    lines: ['X-UA-Compatible'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
  const moved4 = EditorCursorWordPartRight.editorCursorWordPartRight(moved3)
  expect(moved4).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  })
  const moved5 = EditorCursorWordPartRight.editorCursorWordPartRight(moved4)
  expect(moved5).toMatchObject({
    selections: EditorSelection.fromRange(0, 15, 0, 15),
  })
})

// TODO test multiple numbers

// TODO test emojis/special characters

test('editorCursorWordPartRight - jump over whitespace', () => {
  const editor = {
    lines: [' A1323'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test('editorCursorWordPartRight - multiple underscores', () => {
  const editor = {
    lines: ['A__B'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 3, 0, 3),
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  })
})

test('editorCursorWordPartRight - uppercase word', () => {
  const editor = {
    lines: ['REMOTE_PREFIX'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const moved1 = EditorCursorWordPartRight.editorCursorWordPartRight(editor)
  expect(moved1).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
  const moved2 = EditorCursorWordPartRight.editorCursorWordPartRight(moved1)
  expect(moved2).toMatchObject({
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
  const moved3 = EditorCursorWordPartRight.editorCursorWordPartRight(moved2)
  expect(moved3).toMatchObject({
    selections: EditorSelection.fromRange(0, 13, 0, 13),
  })
})
