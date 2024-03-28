import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetAccurateColumnIndex/GetAccurateColumnIndex.js', () => {
  return {
    getAccurateColumnIndex: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const EditorPosition = await import('../src/parts/EditorCommand/EditorCommandPosition.js')
const GetAccurateColumnIndex = await import('../src/parts/GetAccurateColumnIndex/GetAccurateColumnIndex.js')

test('x', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
    x: 5,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  expect(EditorPosition.x(editor, 1, 1)).toBe(13)
})

test('y', () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  expect(EditorPosition.y(editor, 0, 0)).toBe(20)
})

test('at - longer than editor content', () => {
  // @ts-ignore
  GetAccurateColumnIndex.getAccurateColumnIndex.mockImplementation(() => {
    return 0
  })
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    x: 0,
    y: 0,
    columnWidth: 8,
    rowHeight: 20,
    minLineY: 0,
    maxLineY: 1,
    deltaY: 0,
    differences: [],
  }
  expect(EditorPosition.at(editor, 0, 40)).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})

test('at - rowIndex less than zero', () => {
  // @ts-ignore
  GetAccurateColumnIndex.getAccurateColumnIndex.mockImplementation(() => {
    return 0
  })
  const editor = {
    lines: ['test'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    x: 0,
    y: 60,
    columnWidth: 8,
    rowHeight: 20,
    minLineY: 0,
    maxLineY: 1,
    deltaY: 0,
  }
  expect(EditorPosition.at(editor, 20, 40)).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})
