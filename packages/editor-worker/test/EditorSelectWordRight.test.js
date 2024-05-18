import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorSelectWordRight from '../../renderer-worker/src/parts/EditorCommand/EditorCommandSelectWordRight.js'
import * as EditorSelection from '../../renderer-worker/src/parts/EditorSelection/EditorSelection.js'

test('editorSelectWordRight', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordRight - with umlaut', () => {
  const editor = {
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test('editorSelectWordRight - with accent', () => {
  const editor = {
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectWordRight.selectWordRight(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 5),
  })
})
