import { expect, test } from '@jest/globals'
import * as EditorSelectHorizontalRight from '../src/parts/EditorCommand/EditorCommandSelectHorizontalRight.js'
import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test.skip('editorSelectHorizontalRight - single character', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDeltaId.CharacterLeft)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})
