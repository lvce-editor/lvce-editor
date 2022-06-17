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
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 3,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 3,
          columnIndex: 0,
        },
        end: {
          rowIndex: 6,
          columnIndex: 6,
        },
      },
      {
        start: {
          rowIndex: 8,
          columnIndex: 2,
        },
        end: {
          rowIndex: 8,
          columnIndex: 3,
        },
      },
    ],
  }
  expect(EditorSelection.getVisible(editor)).toEqual([
    {
      height: 20,
      left: 0,
      top: 0,
      width: 48,
    },
    {
      height: 20,
      left: 0,
      top: 20,
      width: 48,
    },
    {
      height: 20,
      left: 0,
      top: 40,
      width: 48,
    },
    {
      height: 20,
      left: 16,
      top: 80,
      width: 8,
    },
  ])
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
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 4,
        },
        end: {
          rowIndex: 1,
          columnIndex: 4,
        },
      },
    ],
  }
  expect(EditorSelection.getVisible(editor)).toEqual([
    {
      height: 20,
      left: 32,
      top: 0,
      width: 16,
    },
    {
      height: 20,
      left: 0,
      top: 20,
      width: 32,
    },
  ])
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
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorSelection.getVisible(editor)).toEqual([])
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
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 3,
        },
        end: {
          rowIndex: 2,
          columnIndex: 3,
        },
      },
    ],
  }
  expect(EditorSelection.getVisible(editor)).toEqual([
    {
      height: 20,
      left: 24,
      top: 0,
      width: 24,
    },
    {
      height: 20,
      left: 0,
      top: 20,
      width: 48,
    },
    {
      height: 20,
      left: 0,
      top: 40,
      width: 24,
    },
  ])
})

test.skip('applyEdit - emoji ', () => {
  const editor = {
    uri: '/tmp/foo-U2zmaH/test.txt',
    languageId: 'plaintext',
    lines: ['👮line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    completionTriggerCharacters: [],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
      },
    ],
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
