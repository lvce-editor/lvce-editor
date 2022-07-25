import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ClipBoard/ClipBoard.js', () => ({
  writeText: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

beforeAll(() => {
  // TODO remove this when using newer node version
  // @ts-ignore
  globalThis.DOMException = globalThis.Error
})

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

const EditorCopy = await import(
  '../src/parts/EditorCommand/EditorCommandCopy.js'
)

test('editorCopy', async () => {
  // @ts-ignore
  const spy = ClipBoard.writeText.mockImplementation(() => {})
  const editor = {
    uri: '/tmp/foo-fiiHjX/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
    completionTriggerCharacters: [],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 3,
          columnIndex: 6,
        },
      },
    ],
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    top: 55,
    left: 0,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
  }

  expect(await EditorCopy.editorCopy(editor)).toBe(editor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('line 1\nline 2\nline 3')
})

test('editorCopy - error from clipboard - document is not focused', async () => {
  // @ts-ignore
  ClipBoard.writeText.mockImplementation(() => {
    throw new DOMException('Document is not focused.')
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const editor = {
    uri: '/tmp/foo-fiiHjX/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
    completionTriggerCharacters: [],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 3,
          columnIndex: 6,
        },
      },
    ],
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    top: 55,
    left: 0,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
  }
  expect(await EditorCopy.editorCopy(editor)).toBe(editor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new DOMException('Document is not focused.'))
})
