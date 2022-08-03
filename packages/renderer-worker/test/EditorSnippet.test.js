import * as EditorSnippet from '../src/parts/EditorCommandSnippet/EditorCommandSnippet.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSnippet', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
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
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
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
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: `<div>
  test
</div>`,
    deleted: 0,
  })
  expect(newEditor.lines).toEqual(['  <div>', '    test', '  </div>'])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(2, 8, 2, 8))
})
