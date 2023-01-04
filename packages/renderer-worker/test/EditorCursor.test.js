/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.js'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  isMobileOrTablet: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => ({
  measureTextWidth(text) {
    return text.length * 5
  },
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
  const editor = {
    lines: [''],
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    focused: true,
    lineCache: [
      {
        state: 1,
        tokens: [
          {
            type: 0,
            length: 13,
          },
        ],
      },
    ],
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursor.getVisible(editor)).toEqual([0, 0])
})

test('getVisible - cursor in middle of token', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return false
  })
  const editor = {
    lines: ['abcdefg'],
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    focused: true,
    lineCache: [
      null,
      {
        state: 1,
        tokens: [
          /* type */ 0, /* length */ 1,

          /* type */ 0, /* length */ 4,

          /* type */ 4, /* length */ 4,
        ],
      },
    ],
    selections: EditorSelection.fromRange(0, 7, 0, 7),
  }
  expect(EditorCursor.getVisible(editor)).toEqual([0, 34])
})

test.skip('getVisible - native', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return true
  })
  const editor = {
    lines: [''],
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    selections: EditorSelection.fromRange(0, 0, 0, 0),
  }
  expect(EditorCursor.getVisible(editor)).toEqual([
    {
      rowIndex: 0,
      columnIndex: 0,
    },
  ])
})

test('getVisible - emoji - 👮🏽‍♀️', () => {
  // @ts-ignore
  Platform.isMobileOrTablet.mockImplementation(() => {
    return false
  })
  const editor = {
    lines: ['👮🏽‍♀️'],
    minLineY: 0,
    maxLineY: 10,
    top: 10,
    left: 5,
    rowHeight: 10,
    columnWidth: 8,
    selections: EditorSelection.fromRange(0, 7, 0, 7),
    lineCache: [
      {},
      {
        stack: [],
        state: 0,
        tokens: [/* type */ 1, /* length */ '👮🏽‍♀️'.length],
      },
    ],
    focused: true,
  }
  expect(EditorCursor.getVisible(editor)).toEqual([0, 34])
})
