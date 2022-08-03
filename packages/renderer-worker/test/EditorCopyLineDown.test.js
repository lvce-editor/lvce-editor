import * as EditorCopyLineDown from '../src/parts/EditorCommandCopyLineDown/EditorCommandCopyLineDown.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorCopyLineDown - cursor at start of line', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorCopyLineDown.editorCopyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorCopyLineDown - cursor in middle of line', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    lineCache: [],
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorCopyLineDown.editorCopyLineDown(editor)).toMatchObject({
    lines: ['line 1', 'line 1', 'line 2', 'line 3'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})
