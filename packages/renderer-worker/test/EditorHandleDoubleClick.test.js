import * as EditorHandleDoubleClick from '../src/parts/EditorCommand/EditorCommandHandleDoubleClick.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorHandleDoubleClick - with selection', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
    maxLineY: 100,
  }
  expect(
    EditorHandleDoubleClick.handleDoubleClick(editor, 21, 11, 4)
  ).toMatchObject({
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test.skip('editorHandleDoubleClick - no word to select', () => {
  const editor = {
    lines: ['11111    22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  // TODO should select whitespace
  expect(
    EditorHandleDoubleClick.handleDoubleClick(editor, 68, 11)
  ).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
