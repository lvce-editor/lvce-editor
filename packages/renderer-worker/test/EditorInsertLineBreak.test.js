import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    getLanguageConfiguration: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const EditorInsertLineBreak = await import('../src/parts/EditorCommand/EditorCommandInsertLineBreak.js')
const Languages = await import('../src/parts/Languages/Languages.js')

test('editorInsertLineBreak', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {}
  })
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['', '11111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - with indent', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {
      indentationRules: {
        increaseIndentPattern: '{$',
      },
    }
  })
  const editor = {
    lines: ['{}'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 1, 0, 1),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['{', '  ', '}'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('editorInsertLineBreak - with indent and keep previous indent', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {
      indentationRules: {
        increaseIndentPattern: '{$',
      },
    }
  })
  const editor = {
    lines: ['  {}'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 3, 0, 3),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['  {', '    ', '  }'],
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})

test('editorInsertLineBreak - in middle', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {}
  })
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['11', '111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - with whitespace at start', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {}
  })
  const editor = {
    lines: ['    11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 2, 0, 2),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['  ', '    11111', '22222'],
    selections: EditorSelection.fromRange(1, 2, 1, 2),
  })
})

test('editorInsertLineBreak - with selection', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {}
  })
  const editor = {
    lines: ['11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 0, 0, 2),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['', '111', '22222'],
    selections: EditorSelection.fromRange(1, 0, 1, 0),
  })
})

test('editorInsertLineBreak - cursor at end of line', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {}
  })
  const editor = {
    lines: ['    11111', '22222'],
    primarySelectionIndex: 0,
    selections: EditorSelection.fromRange(0, 9, 0, 9),
    undoStack: [],
  }
  expect(await EditorInsertLineBreak.insertLineBreak(editor)).toMatchObject({
    lines: ['    11111', '    ', '22222'],
    selections: EditorSelection.fromRange(1, 4, 1, 4),
  })
})
