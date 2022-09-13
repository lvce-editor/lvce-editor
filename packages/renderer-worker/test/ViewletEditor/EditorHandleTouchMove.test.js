import { jest } from '@jest/globals'
import * as EditorHandleTouchMove from '../src/parts/EditorCommand/EditorCommandHandleTouchMove.js'
import * as EditorHandleTouchStart from '../src/parts/EditorCommand/EditorCommandHandleTouchStart.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test.skip('editorHandleTouchMove - single touch', () => {
  const editor = {
    lines: ['11111', '22222'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    selections: [],
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
    finalDeltaY: 100,
    lineCache: [],
  }
  EditorHandleTouchStart.state.deltaY = 0
  EditorHandleTouchStart.state.touchOffsetY = 40
  RendererProcess.state.send = jest.fn()
  EditorHandleTouchMove.editorHandleTouchMove(editor, {
    touches: [{ x: 45, y: 35 }],
  })
  expect(editor.deltaY).toBe(5)
})
