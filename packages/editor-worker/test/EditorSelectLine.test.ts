import { expect, test } from '@jest/globals'
import * as EditorSelectLine from '../src/parts/EditorCommand/EditorCommandSelectLine.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

// TODO test with multiple cursors
test('editorSelectLine', () => {
  const editor = {
    lines: ['word1 word2 word3', 'word4 word5 word6'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectLine.selectLine(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 17),
  })
})
