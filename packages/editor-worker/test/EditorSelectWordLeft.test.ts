import { expect, test } from '@jest/globals'
import * as EditorSelectWordLeft from '../src/parts/EditorCommand/EditorCommandSelectWordLeft.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorSelectWordLeft', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorSelectWordLeft.selectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 0),
  })
})

test('editorSelectWordLeft - with umlaut', () => {
  const editor = {
    lines: ['füße'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(EditorSelectWordLeft.selectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 0),
  })
})

test('editorSelectWordLeft - with accent', () => {
  const editor = {
    lines: ['tàste'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 5, 0, 5),
  }
  expect(EditorSelectWordLeft.selectWordLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 5, 0, 0),
  })
})
