import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as EditorSelectInsideString from '../../renderer-worker/src/parts/EditorCommand/EditorCommandSelectInsideString.js'
import * as EditorSelection from '../../renderer-worker/src/parts/EditorSelection/EditorSelection.js'

test('editorSelectInsideString', () => {
  const editor = {
    lines: ['"line 1"', '"line 2"'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorSelectInsideString.selectInsideString(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 7),
  })
})
