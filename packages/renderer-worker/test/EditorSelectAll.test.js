import * as EditorSelectAll from '../src/parts/EditorCommand/EditorCommandSelectAll.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
