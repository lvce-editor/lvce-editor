import * as EditorSnippet from '../src/parts/EditorCommand/EditorCommandSnippet.js'
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

test('editorSnippet - replace cursor', () => {
  const editor = {
    lines: ['h1'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: '<h1>$0</h1>',
    deleted: 2,
    type: /* Snippet */ 2,
  })
  expect(newEditor.lines).toEqual(['<h1></h1>'])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 4, 0, 4))
})

test.skip('editorSnippet - replace with multiline snippet', () => {
  const editor = {
    lines: ['div'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    undoStack: [],
  }
  const newEditor = EditorSnippet.editorSnippet(editor, {
    inserted: '<div>\n\t$0\n</div>',
    deleted: 3,
    type: /* Snippet */ 2,
  })
  expect(newEditor.lines).toEqual(['<div>\n\t$0\n</div>'])
  expect(newEditor.selections).toEqual(EditorSelection.fromRange(0, 4, 0, 4))
})
