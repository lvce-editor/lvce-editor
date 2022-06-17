import * as EditorSnippet from '../src/parts/EditorCommand/EditorCommandSnippet.js'

test('editorSnippet', () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: 'a',
    deleted: 0,
  })
  expect(newEditor.lines).toEqual(['a'])
})

test('editorSnippet - empty', () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: '',
    deleted: 0,
  })
  expect(newEditor.lines).toEqual([''])
})

test('editorSnippet - multiline snippet', () => {
  const editor = {
    lines: ['  '],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: `<div>
  test
</div>`,
    deleted: 0,
  })
  expect(newEditor.lines).toEqual(['  <div>', '    test', '  </div>'])
  expect(newEditor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 8,
  })
})
