import * as EditorCommandUndo from '../src/parts/EditorCommand/EditorCommandUndo.js'

test('undo - inserted character', () => {
  const editor = {
    lines: ['a'],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
          inserted: ['a'],
          deleted: [''],
          origin: 'editorType',
        },
      ],
    ],
  }
  const newEditor = EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual([''])
})

test('undo - deleted character', () => {
  const editor = {
    lines: [''],
    selections: new Uint32Array([0, 0, 1, 1]),
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
          inserted: [''],
          deleted: ['a'],
          origin: 'editorType',
        },
      ],
    ],
  }
  const newEditor = EditorCommandUndo.undo(editor)
  expect(newEditor.lines).toEqual(['a'])
})
