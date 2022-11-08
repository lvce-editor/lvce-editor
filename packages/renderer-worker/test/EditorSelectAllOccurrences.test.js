import * as EditorSelectAllOccurrences from '../src/parts/EditorCommand/EditorCommandSelectAllOccurrences.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('selectAllOccurrences - single line selection', () => {
  const editor = {
    lines: ['sample text, sample text'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  }
  expect(EditorSelectAllOccurrences.selectAllOccurrences(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRanges([0, 0, 0, 5], [0, 13, 0, 18]),
    }
  )
})

test('selectAllOccurrences - single line selection - no more to add', () => {
  const editor = {
    lines: ['sample text'],
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  }
  expect(EditorSelectAllOccurrences.selectAllOccurrences(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRange(0, 0, 0, 5),
    }
  )
  // TODO test that renderProcess.send has not been called since selection has not been modified
})

test('selectAllOccurrences - no selections, but word at cursor position exists', () => {
  const editor = {
    lines: ['sample text, sample text'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 6, 0, 6]),
  }
  expect(EditorSelectAllOccurrences.selectAllOccurrences(editor)).toMatchObject(
    {
      selections: new Uint32Array([0, 0, 0, 6, 0, 13, 0, 19]),
    }
  )
})

test('selectAllOccurrences - no selections and no word at cursor position', () => {
  const editor = {
    lines: ['before         after'],
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  }
  expect(EditorSelectAllOccurrences.selectAllOccurrences(editor)).toMatchObject(
    {
      selections: new Uint32Array([0, 10, 0, 10]),
    }
  )
})

test('selectAllOccurrences - multi line selection', () => {
  const editor = {
    lines: ['sample text', 'sample text', 'sample text'],
    selections: EditorSelection.fromRange(0, 7, 1, 6),
  }
  expect(EditorSelectAllOccurrences.selectAllOccurrences(editor)).toMatchObject(
    {
      selections: EditorSelection.fromRanges([0, 7, 1, 6], [1, 7, 2, 6]),
    }
  )
})

// TODO test for ambiguous multiline match
