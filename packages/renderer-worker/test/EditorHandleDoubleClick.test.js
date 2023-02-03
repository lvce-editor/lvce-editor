import { jest } from '@jest/globals'
import * as ModifierKey from '../src/parts/ModifierKey/ModifierKey.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandPosition.js', () => {
  return {
    at: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const EditorPosition = await import('../src/parts/EditorCommand/EditorCommandPosition.js')
const EditorHandleDoubleClick = await import('../src/parts/EditorCommand/EditorCommandHandleDoubleClick.js')
const TokenizePlainText = await import('../src/parts/TokenizePlainText/TokenizePlainText.js')
const EditorSelection = await import('../src/parts/EditorSelection/EditorSelection.js')

test('editorHandleDoubleClick - with selection', () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 4,
    }
  })
  const editor = {
    lines: ['line 1', 'line 2'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
    maxLineY: 100,
  }
  expect(EditorHandleDoubleClick.handleDoubleClick(editor, 21, 11)).toMatchObject({
    lines: ['line 1', 'line 2'],
    selections: EditorSelection.fromRange(0, 0, 0, 4),
  })
})

test.skip('editorHandleDoubleClick - no word to select', () => {
  // @ts-ignore
  EditorPosition.at.mockImplementation(() => {
    return {
      rowIndex: 0,
      columnIndex: 0,
    }
  })
  const editor = {
    lines: ['11111    22222'],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    x: 20,
    y: 10,
    rowHeight: 10,
    columnWidth: 8,
    tokenizer: TokenizePlainText,
    deltaY: 0,
  }
  // TODO should select whitespace
  expect(EditorHandleDoubleClick.handleDoubleClick(editor, 68, 11)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  })
})
