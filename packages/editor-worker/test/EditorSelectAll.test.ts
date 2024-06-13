import { expect, test } from '@jest/globals'
import * as EditorSelectAll from '../src/parts/EditorCommand/EditorCommandSelectAll.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorSelectAll', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectAll.selectAll(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 2, 0),
  })
})
