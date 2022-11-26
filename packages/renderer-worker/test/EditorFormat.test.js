import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Format/Format.js', () => {
  return {
    format: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js',
  () => {
    return {
      editorShowMessage: jest.fn(() => {}),
    }
  }
)

const Format = await import('../src/parts/Format/Format.js')

const EditorFormat = await import(
  '../src/parts/EditorCommand/EditorCommandFormat.js'
)
const EditorShowMessage = await import(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js'
)

test('format - error', async () => {
  // @ts-ignore
  Format.format.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', ''],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  expect(await EditorFormat.format(editor)).toBe(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'TypeError: x is not a function',
    true
  )
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new TypeError('x is not a function'))
})

test('format', async () => {
  // @ts-ignore
  Format.format.mockImplementation(() => {
    return [
      {
        startOffset: 0,
        endOffset: 1,
        inserted: 'b',
      },
    ]
  })
  const editor = {
    lines: ['a'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorFormat.format(editor)).toMatchObject({
    lines: ['b'],
  })
})

test('format - preserve cursor position', async () => {
  // @ts-ignore
  Format.format.mockImplementation(() => {
    return [
      {
        startOffset: 3,
        endOffset: 5,
        inserted: '',
      },
      {
        startOffset: 4,
        endOffset: 34,
        inserted: '\n',
      },
    ]
  })
  const editor = {
    lines: ['<h1   class="abc">hello world</h1>'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 5, 0, 5]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorFormat.format(editor)).toMatchObject({
    lines: ['<h1 class="abc">hello world</h1>'],
  })
})

test('format - multiple lines', async () => {
  // @ts-ignore
  Format.format.mockImplementation(() => {
    return [
      {
        startOffset: 0,
        endOffset: 25,
        inserted: `h1 {
  font-size: 20px;
}`,
      },
    ]
  })
  const editor = {
    lines: ['h1 {', '  font-size: 20px', '}'],
    primarySelectionIndex: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    top: 10,
    left: 20,
    rowHeight: 10,
    columnWidth: 8,
    lineCache: [],
    undoStack: [],
  }
  expect(await EditorFormat.format(editor)).toMatchObject({
    lines: ['h1 {', '  font-size: 20px;', '}'],
  })
})
