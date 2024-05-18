import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorSelectAllRight from '../EditorCommand/EditorCommandSelectAllRight.js'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

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
