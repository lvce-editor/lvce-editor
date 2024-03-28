import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorSelectCharacterLeft from '../src/parts/EditorCommand/EditorCommandSelectCharacterLeft.js'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

test('editorSelectCharacterLeft - single character', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorSelectCharacterLeft.selectCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 0),
  })
})

test('editorSelectCharacterLeft - at start of file', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorSelectCharacterLeft.selectCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})

test('editorSelectCharacterLeft - reversed selection', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 4, 0, 3),
  }
  expect(EditorSelectCharacterLeft.selectCharacterLeft(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 4, 0, 2),
  })
})
