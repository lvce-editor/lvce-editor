import * as EditorSelectHorizontalRight from '../src/parts/EditorCommand/EditorCommandSelectHorizontalRight.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('editorSelectHorizontalRight - single character', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, () => 1)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})
