import { jest } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => {
  return {
    measureTextWidth(text) {
      return text.length * 8
    },
  }
})

const EditorSelection = await import('../src/parts/Editor/EditorSelection.js')

test('getVisible', () => {
  const editor = {
    x: 20,
    y: 10,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 4,
    maxLineY: 8,
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5', 'line 6', 'line 7', 'line 8', 'line 9', 'line 10'],
    selections: new Uint32Array([1, 3, 2, 4, 3, 0, 6, 6, 8, 2, 8, 3]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(['48px 40px', '24px 80px'])
  expect(selectionInfos).toEqual(
    // prettier-ignore
    [
      /* x */ '0px', /* y */
'0px', /* width */
'48px', /* height */
'20px',
      /* x */ '0px', /* y */
'20px', /* width */
'48px', /* height */
'20px',
      /* x */ '0px', /* y */
'40px', /* width */
'48px', /* height */
'20px',
      /* x */ '16px', /* y */
'80px', /* width */
'8px', /* height */
'20px',
    ],
  )
})

test('getVisible - bug with two lines', () => {
  const editor = {
    x: 0,
    y: 0,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 4,
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    selections: new Uint32Array([0, 4, 1, 4]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(['32px 20px'])
  // prettier-ignore
  expect(selectionInfos).toEqual(
    [
      /* x */ '32px', /* y */
'0px', /* width */
'16px', /* height */
'20px',
      /* x */ '0px', /* y */
'20px', /* width */
'32px', /* height */
'20px',
    ],
  )
})

test('getVisible - cursors should be treated separately', () => {
  const editor = {
    x: 0,
    y: 0,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 4,
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    selections: new Uint32Array([0, 4, 0, 4]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(['32px 0px'])
  expect(selectionInfos).toEqual([])
})

test('getVisible - bug with multiple lines', () => {
  const editor = {
    x: 20,
    y: 10,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 8,
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5', 'line 6', 'line 7', 'line 8', 'line 9', 'line 10'],
    selections: new Uint32Array([0, 3, 2, 3]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(['24px 40px'])
  // prettier-ignore
  expect(selectionInfos).toEqual(
    [
      /* x */ '24px',/* y */
'0px', /* width */
'24px', /* height */
'20px',
      /* x */ '0px', /* y */
'20px', /* width */
'48px', /* height */
'20px',
      /* x */ '0px', /* y */
'40px', /* width */
'24px', /* height */
'20px',
    ],
  )
})

test.skip('applyEdit - emoji ', () => {
  const editor = {
    uri: '/tmp/foo-U2zmaH/test.txt',
    languageId: 'plaintext',
    lines: ['👮line 1'],
    completionTriggerCharacters: [],
    selections: new Uint32Array([0, 0, 0, 0]),
    id: 1,
    tokenizer: {
      TokenMap: {
        0: 'Text',
      },
      TokenType: {
        Text: 0,
        NewLine: 1,
      },
      initialLineState: {
        state: 1,
      },
    },
    deltaY: 0,
    minLineY: 0,
    maxLineY: 1,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    x: 0,
    y: 55,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 0,
          },
          inserted: ['😁'],
          deleted: [''],
          origin: EditOrigin.EditorType,
        },
      ],
      [
        {
          start: {
            rowIndex: 0,
            columnIndex: 0,
          },
          end: {
            rowIndex: 0,
            columnIndex: 2,
          },
          inserted: [''],
          deleted: ['😁'],
          origin: EditOrigin.Delete,
        },
      ],
    ],
    lineCache: [
      null,
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
    validLines: [],
    invalidStartIndex: 1,
  }
  const changes = [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 0,
      },
      inserted: ['👮'],
      deleted: [''],
      origin: EditOrigin.EditorType,
    },
  ]
  expect(EditorSelection.applyEdit(editor, changes)).toMatchObject({})
})

test('getVisible - only start of selection visible', () => {
  const editor = {
    x: 20,
    y: 10,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 8,
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5', 'line 6', 'line 7', 'line 8', 'line 9', 'line 10', 'line 11', 'line 12', 'line 13'],
    selections: new Uint32Array([0, 0, 12, 0]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual([])
  // prettier-ignore
  expect(selectionInfos).toEqual(
    [
     /* x */ '0px', /* y */
'0px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'20px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'40px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'60px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'80px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'100px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'120px', /* width */
'48px', /* height */
'20px',
     /* x */ '0px', /* y */
'140px', /* width */
'48px', /* height */
'20px',
    ])
})

test('getVisible - selection out of range', () => {
  const editor = {
    x: 20,
    y: 10,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 8,
    lines: ['line 1'],
    selections: new Uint32Array([0, 0, 0, 0, 7, 7, 7, 7]),
    fontWeight: 400,
    fontFamily: 'Test',
    letterSpacing: 0,
    fontSize: 15,
    cursorWidth: 0,
    tabSize: 2,
    width: 800,
    differences: [0, 0, 0, 0, 0, 0, 0, 0],
    focused: true,
    isMonospaceFont: false,
    charWidth: 9,
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(['0px 0px', '0px 140px'])
  expect(selectionInfos).toEqual(['0px', '0px', '0px', '20px', '0px', '140px', '0px', '20px'])
})
