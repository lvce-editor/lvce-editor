import * as EditorCommandSortLinesAscending from '../src/parts/EditorCommand/EditorCommandSortLinesAscending.js'

test('sortLinesAscending - two unsorted lines', () => {
  const editor = {
    lines: ['b', 'a'],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [],
  }
  const newEditor = EditorCommandSortLinesAscending.sortLinesAscending(editor)
  expect(newEditor.lines).toEqual(['a', 'b'])
})

// TODO
test.skip('sortLinesAscending - with underscores - https://github.com/microsoft/vscode/issues/48123', () => {
  const editor = {
    lines: ['a_b.txt', 'a_b_c.txt'],
    selections: new Uint32Array([0, 0, 1, 9]),
    undoStack: [],
  }
  const newEditor = EditorCommandSortLinesAscending.sortLinesAscending(editor)
  expect(newEditor.lines).toEqual(['a_b.txt', 'a_b_c.txt'])
})
