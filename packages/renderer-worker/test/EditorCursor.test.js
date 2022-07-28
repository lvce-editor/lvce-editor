/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isMobileOrTablet: jest.fn().mockImplementation(() => {
    throw new Error('not implemented')
  }),
}))

const Platform = await import('../src/parts/Platform/Platform.js')

const EditorCursor = await import('../src/parts/Editor/EditorCursor.js')

beforeEach(() => {
  jest.resetAllMocks()
})
test('getVisible - desktop', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return false
  })
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursor.getVisible(editor)).toEqual([
    {
      left: 0,
      top: 0,
    },
  ])
})

test('getVisible - native', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return true
  })
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: [''],
    cursor,
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorCursor.getVisible(editor)).toEqual([
    {
      rowIndex: 0,
      columnIndex: 0,
    },
  ])
})

test.only('getVisible - emoji - 👮🏽‍♀️', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return false
  })
  const cursor = {
    rowIndex: 0,
    columnIndex: 7,
  }
  const editor = {
    lines: ['👮🏽‍♀️'],
    cursor,
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
    lineCache: [
      {},
      {
        stack: [],
        state: 0,
        tokens: [
          {
            type: 1,
            length: '👮🏽‍♀️'.length,
          },
        ],
      },
    ],
  }
  expect(EditorCursor.getVisible(editor)).toEqual([
    {
      leftIndex: 0,
      remainingOffset: 7,
      top: 0,
      topIndex: 0,
    },
  ])
})
