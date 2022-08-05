import * as EditorSelection from '../src/parts/Editor/EditorSelection.js'

test('getVisible', () => {
  const editor = {
    top: 10,
    left: 20,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 4,
    maxLineY: 8,
    lines: [
      'line 1',
      'line 2',
      'line 3',
      'line 4',
      'line 5',
      'line 6',
      'line 7',
      'line 8',
      'line 9',
      'line 10',
    ],
    selections: new Uint32Array([1, 3, 2, 4, 3, 0, 6, 6, 8, 2, 8, 3]),
  }
  expect(EditorSelection.getVisible(editor)).toEqual(
    new Uint32Array([
      /* top */ 0, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 20, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 40, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 80, /* left */ 16, /* width */ 8, /* height */ 20,
    ])
  )
})

test('getVisible - bug with two lines', () => {
  const editor = {
    top: 0,
    left: 0,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 4,
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    selections: new Uint32Array([0, 4, 1, 4]),
  }
  expect(EditorSelection.getVisible(editor)).toEqual(
    new Uint32Array([
      /* top */ 0, /* left */ 32, /* width */ 16, /* height */ 20 /*  */,
      /* top */ 20, /* left */ 0, /* width */ 32, /* height */ 20,
    ])
  )
})

test('getVisible - cursors should be treated separately', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    top: 0,
    left: 0,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 4,
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    selections: new Uint32Array([0, 4, 0, 4]),
  }
  expect(EditorSelection.getVisible(editor)).toEqual(new Uint32Array([]))
})

test('getVisible - bug with multiple lines', () => {
  const editor = {
    top: 10,
    left: 20,
    rowHeight: 20,
    columnWidth: 8,
    minLineY: 0,
    maxLineY: 8,
    lines: [
      'line 1',
      'line 2',
      'line 3',
      'line 4',
      'line 5',
      'line 6',
      'line 7',
      'line 8',
      'line 9',
      'line 10',
    ],
    selections: new Uint32Array([0, 3, 2, 3]),
  }
  expect(EditorSelection.getVisible(editor)).toEqual(
    new Uint32Array([
      /* top */ 0, /* left */ 24, /* width */ 24, /* height */ 20 /*  */,
      /* top */ 20, /* left */ 0, /* width */ 48, /* height */ 20 /*  */,
      /* top */ 40, /* left */ 0, /* width */ 24, /* height */ 20,
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
    top: 55,
    left: 0,
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
          origin: 'editorType',
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
          origin: 'delete',
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
      origin: 'editorType',
    },
  ]
  expect(EditorSelection.applyEdit(editor, changes)).toMatchObject({})
})
