import { jest } from '@jest/globals'
import * as EditorPaste from '../src/parts/EditorCommand/EditorCommandPaste.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

// TODO jest unstable_mockModule doesn't seem to work anymore after upgrade from jest 27 to jest 28
jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.js', () => {
  return {
    readText() {
      return 'abc'
    },
  }
})

test.skip('editorPaste', async () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [],
    tokenizer: TokenizePlainText,
  }
  RendererProcess.state.send = jest.fn()
  await EditorPaste.editorPaste(editor)
  expect(editor.lines).toEqual(['abc'])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 3,
  })
  expect(editor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 3,
      },
      end: {
        rowIndex: 0,
        columnIndex: 3,
      },
    },
  ])
})
