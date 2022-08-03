import * as EditorDeleteWordRight from '../src/parts/EditorCommandDeleteWordRight/EditorCommandDeleteWordRight.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorDeleteWordRight', () => {
  const editor = {
    lines: ['sample text'],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    lineCache: [],
    undoStack: [],
  }
  expect(EditorDeleteWordRight.editorDeleteWordRight(editor)).toMatchObject({
    lines: ['sample '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})

test.skip('editorDeleteWordRight - when there is not word right', () => {
  const editor = {
    lines: ['sample   '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    tokenizer: TokenizePlainText,
    undoStack: [],
  }
  expect(EditorDeleteWordRight.editorDeleteWordRight(editor)).toMatchObject({
    lines: ['sample  '],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  })
})
