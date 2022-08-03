import * as EditorPasteText from '../src/parts/EditorCommandPasteText/EditorCommandPasteText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorPasteText', () => {
  const editor = {
    lines: [''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(EditorPasteText.editorPasteText(editor, 'line 1')).toMatchObject({
    lines: ['line 1'],
    selections: EditorSelection.fromRange(0, 6, 0, 6),
  })
})

test.skip('editorPasteText - middle of line', () => {
  const editor = {
    lines: ['aaa', 'bbb', 'ccc'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(1, 1, 1, 1),
  }
  expect(
    EditorPasteText.editorPasteText(
      editor,
      ` 111
222 `
    )
  ).toMatchObject({
    lines: ['aaa', 'b 111', '222 bb', 'ccc'],
    selections: EditorSelection.fromRange(2, 4, 2, 4),
  })
})

test('editorPasteText - issue with pasting multiple lines', () => {
  const editor = {
    uri: '/tmp/foo-ScUYJ4/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    completionTriggerCharacters: [],
    selections: EditorSelection.fromRange(0, 0, 3, 6),
    id: 1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    top: 55,
    left: 0,
    undoStack: [],
    validLines: [],
    invalidStartIndex: 3,
  }
  expect(
    EditorPasteText.editorPasteText(
      editor,
      `line 1
line 2
line 3`
    )
  ).toMatchObject({
    lines: ['line 1', 'line 2', 'line 3'],
  })
})
