import * as EditorSelectAllRight from '../src/parts/EditorCommand/EditorCommandSelectAllRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectAllRight = at start', () => {
  const editor = {
    lines: ['1 2 3 4 5'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    tokenizer: TokenizePlainText,
  }
  expect(EditorSelectAllRight.editorSelectAllRight(editor)).toMatchObject({
    lines: ['1 2 3 4 5'],
    selections: EditorSelection.fromRange(0, 0, 0, 9),
  })
})

test('editorSelectAllRight in middle', () => {
  const editor = {
    lines: ['1 2 3 4 5'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  }
  expect(EditorSelectAllRight.editorSelectAllRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 9),
  })
})
