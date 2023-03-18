import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.js'
import { jest } from '@jest/globals'

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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([/*x */ 48, /* y */ 40, /* x */ 24, /* y */ 80]))
  expect(selectionInfos).toEqual(
    // prettier-ignore
    new Float32Array([
      /* x */ 0,  /* y */ 0,  /* width */ 48, /* height */ 20,
      /* x */ 0,  /* y */ 20, /* width */ 48, /* height */ 20,
      /* x */ 0,  /* y */ 40, /* width */ 48, /* height */ 20,
      /* x */ 16, /* y */ 80, /* width */ 8,  /* height */ 20,
    ])
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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([/*x */ 32, /* y */ 20]))
  expect(selectionInfos).toEqual(
    // prettier-ignore
    new Float32Array([
      /* x */ 32, /* y */ 0, /* width */ 16, /* height */ 20,
      /* x */ 0, /* y */ 20, /* width */ 32,  /* height */ 20,
    ])
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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([/*x */ 32, /* y */ 0]))
  expect(selectionInfos).toEqual(new Float32Array([]))
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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([/* x */ 24, /* y */ 40]))
  expect(selectionInfos).toEqual(
    // prettier-ignore
    new Float32Array([
      /* x */ 24,/* y */ 0,  /* width */ 24, /* height */ 20,
      /* x */ 0, /* y */ 20, /* width */ 48, /* height */ 20,
      /* x */ 0, /* y */ 40, /* width */ 24, /* height */ 20,
    ])
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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([]))
  expect(selectionInfos).toEqual(
    // prettier-ignore
    new Float32Array([
     /* x */ 0, /* y */ 0, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 20, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 40, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 60, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 80, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 100, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 120, /* width */ 48, /* height */ 20,
     /* x */ 0, /* y */ 140, /* width */ 48, /* height */ 20,
    ])
  )
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
  }
  const { cursorInfos, selectionInfos } = EditorSelection.getVisible(editor)
  expect(cursorInfos).toEqual(new Float32Array([0, 0, 0, 140]))
  expect(selectionInfos).toEqual(
    // prettier-ignore
    new Float32Array([])
  )
})
