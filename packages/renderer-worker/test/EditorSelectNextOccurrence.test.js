import * as EditorSelectNextOccurrence from '../src/parts/EditorCommand/EditorCommandSelectNextOccurrence.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test.skip('editorSelectNextOccurrence - no selection and no word at cursor position', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['  sample text'],
    cursor,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)).toBe(
    editor
  )
})

test('editorSelectNextOccurrence - no selection and cursor position at start of word', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 0, 0, 4))
})

test('editorSelectNextOccurrence - no selection and cursor position at end of word', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 0, 0, 4))
})

test('editorSelectNextOccurrence - one selection and more selections possible after', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4])
  )
})

test('editorSelectNextOccurrence - one selection and more selections possible before', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 0, 1, 4),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4])
  )
})

test('editorSelectNextOccurrence - one selection and more selections possible in middle', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [2, 0, 2, 4]),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  // expect(newEditor.cursor).toEqual({
  //   rowIndex: 1,
  //   columnIndex: 4,
  // })
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4], [2, 0, 2, 4])
  )
})

test('editorSelectNextOccurrence - one selection and more selections possible in middle in first line', () => {
  const editor = {
    lines: ['line 1 line 2 line 3', 'line 4', 'line 5'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges(
      [0, 0, 0, 4],
      [0, 7, 0, 11],
      [2, 0, 2, 4]
    ),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  // expect(newEditor.cursor).toEqual({
  //   rowIndex: 1,
  //   columnIndex: 4,
  // })
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges(
      [0, 0, 0, 4],
      [0, 7, 0, 11],
      [0, 14, 0, 18],
      [2, 0, 2, 4]
    )
  )
})

test.skip('editorSelectNextOccurrence - one selection and more selections possible before in same line', () => {
  const editor = {
    lines: ['line 1 line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 7, 0, 11),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)

  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [0, 7, 0, 11])
  )
})

test('editorSelectNextOccurrence - one selection and no more selections possible', () => {
  const editor = {
    lines: ['line 1'],
    primarySelectionIndex: 0,

    selections: EditorSelection.fromRange(0, 0, 0, 4),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 0, 0, 4))
})

test('editorSelectNextOccurrence - multiple selections and no more selections possible', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4]),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [1, 0, 1, 4])
  )
})

test('editorSelectNextOccurrence - multiple selections in same line and no more selections possible', () => {
  const editor = {
    lines: ['line 1 line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRanges([0, 0, 0, 4], [0, 7, 0, 11]),
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 4], [0, 7, 0, 11])
  )
})
// TODO add tests when there is selection

// TODO add tests for single-line and multiline selection

// TODO test next occurrence at end of file (next occurrence is at start)

// TODO need many more tests

// TODO test some selections empty, some not empty

// TODO test some selections same word, some different word, some empty

// TODO test some single line selections, some multiline selections

test.skip('editorSelectNextOccurrence - new word out of viewport', () => {
  const editor = {
    lines: [
      'sample text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'sample text',
    ],
    selections: EditorSelection.fromRange(0, 0, 0, 11),
    deltaY: 0,
    rowHeight: 20,
    height: 60,
    minLineY: 0,
    maxLineY: 3,
    finalDeltaY: 200,
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(editor.selections).toEqual(
    EditorSelection.fromRanges([0, 0, 0, 11], [12, 0, 12, 11])
  )
  expect(newEditor.deltaY).toBe(140) // scroll down by 7 lines
})
