import { expect, test } from '@jest/globals'
import * as EditorSelectHorizontalRight from '../src/parts/EditorCommand/EditorCommandSelectHorizontalRight.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test.skip('editorSelectHorizontalRight - single character', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  // @ts-ignore
  expect(EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDeltaId.CharacterLeft)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})
