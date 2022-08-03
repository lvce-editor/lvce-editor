import * as EditorSelectCharacterRight from '../src/parts/EditorCommandSelectCharacterRight/EditorCommandSelectCharacterRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectCharacterRight - no selection', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})

test.skip('editorSelectCharacterRight - no selection and at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 6, 1, 1),
  })
})

test('editorSelectCharacterRight - has selection - single line', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 2),
  })
})

test.skip('editorSelectCharacterRight - has selection - nothing more to select', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 2, 1),
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 2, 1),
  })
})

test.skip('editorSelectCharacterRight - has selection - merge selections', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges([0, 0, 0, 6], [1, 0, 0, 6]),
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 2, 1),
  })
})
