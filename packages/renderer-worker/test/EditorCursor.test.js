/**
 * @jest-environment jsdom
 */
import * as EditorCursor from '../src/parts/Editor/EditorCursor.js'
import * as Platform from '../src/parts/Platform/Platform.js'

beforeEach(() => {
  Platform.state.cachedIsMobileOrTablet = undefined
})

test('getVisible - desktop', () => {
  Platform.state.isMobileOrTablet = () => false
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
  Platform.state.isMobileOrTablet = () => true
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
  Platform.state.isMobileOrTablet = () => {
    return false
  }
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
