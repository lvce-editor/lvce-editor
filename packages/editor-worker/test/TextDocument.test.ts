import { expect, test } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

test('applyEdits - one single line edit', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
        inserted: ['a'],
        deleted: [''],
      },
    ]),
  ).toEqual(['a'])
})

test('applyEdits - one multi line edit', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 1,
          columnIndex: 2,
        },
        inserted: ['a'],
        deleted: ['ine 1', 'li'],
      },
    ]),
  ).toEqual(['lane 2'])
})

test('applyEdits - new line inserted', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
        inserted: ['', ''],
        deleted: [''],
      },
    ]),
  ).toEqual(['', 'line 1', 'line 2'])
})

test('applyEdits - multiple new lines inserted', () => {
  const textDocument = {
    lines: ['line 1', 'line 2'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
        inserted: ['', '', '', ''],
        deleted: [''],
      },
    ]),
  ).toEqual(['', '', '', 'line 1', 'line 2'])
})

test('applyEdits - virtual space insertion', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 5,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
        inserted: ['a'],
        deleted: [''],
      },
    ]),
  ).toEqual(['     a'])
})

test('applyEdits - new line inserted in middle', () => {
  const textDocument = {
    lines: ['    11111', '22222'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
        inserted: ['', ''],
        deleted: [''],
        origin: EditOrigin.InsertLineBreak,
      },
    ]),
  ).toEqual(['  ', '  11111', '22222'])
})

test('applyEdits - multiple insertions in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    sample test', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: { rowIndex: 1, columnIndex: 4 },
        end: { rowIndex: 1, columnIndex: 4 },
        inserted: ['<!--'],
        deleted: [''],
        origin: EditOrigin.ToggleBlockComment,
      },
      {
        start: { rowIndex: 1, columnIndex: 20 },
        end: { rowIndex: 1, columnIndex: 20 },
        inserted: ['-->'],
        deleted: [''],
        origin: EditOrigin.ToggleBlockComment,
      },
    ]),
  ).toEqual(['  <body>', '    <!--sample test -->', '  </body>'])
})

test('applyEdits - single deletion in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: { rowIndex: 1, columnIndex: 4 },
        end: { rowIndex: 1, columnIndex: 8 },
        inserted: [],
        deleted: ['<!--'],
        origin: EditOrigin.ToggleBlockComment,
      },
    ]),
  ).toEqual(['  <body>', '    sample test-->', '  </body>'])
})

test('applyEdits - multiple deletions in one line', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: { rowIndex: 1, columnIndex: 4 },
        end: { rowIndex: 1, columnIndex: 8 },
        inserted: [''],
        deleted: ['<!--'],
        origin: EditOrigin.ToggleBlockComment,
      },
      {
        start: { rowIndex: 1, columnIndex: 15 },
        end: { rowIndex: 1, columnIndex: 18 },
        inserted: [''],
        deleted: ['-->'],
        origin: EditOrigin.ToggleBlockComment,
      },
    ]),
  ).toEqual(['  <body>', '    sample test', '  </body>'])
})

test('applyEdits - deletions in multiple lines', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test', '-->', '  </body>'],
  }
  const edits = [
    {
      start: { rowIndex: 1, columnIndex: 4 },
      end: { rowIndex: 1, columnIndex: 8 },
      inserted: [],
      deleted: ['<!--'],
      origin: EditOrigin.ToggleBlockComment,
    },
    {
      start: { rowIndex: 2, columnIndex: 0 },
      end: { rowIndex: 2, columnIndex: 3 },
      inserted: [],
      deleted: ['-->'],
      origin: EditOrigin.ToggleBlockComment,
    },
  ]
  expect(TextDocument.applyEdits(textDocument, edits)).toEqual(['  <body>', '    sample test', '', '  </body>'])
})

test('positionAt - in first line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      4,
    ),
  ).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
})

test('positionAt - at end of first line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      5,
    ),
  ).toEqual({
    rowIndex: 0,
    columnIndex: 5,
  })
})

test('positionAt - at start of second line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      6,
    ),
  ).toEqual({
    rowIndex: 1,
    columnIndex: 0,
  })
})

test('applyEdits - issue with pasting many lines', () => {
  const textDocument = {
    lines: [''],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 0,
        },
        inserted: [...Array.from({ length: 150_000 }).fill('a')],
        deleted: [''],
      },
    ]),
  ).toEqual([...Array.from({ length: 150_000 }).fill('a')])
})

test('applyEdits - virtual space', () => {
  const textDocument = {
    uri: '/test/test.txt',
    languageId: 'plaintext',
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 3,
      columnIndex: 6,
    },
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
    id: 1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    x: 0,
    y: 55,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 3,
          columnIndex: 6,
        },
        inserted: ['line 1,line 2,line 3'],
        deleted: ['line 1', 'line 2', 'line 3'],
        origin: EditOrigin.EditorPasteText,
      },
    ]),
  ).toEqual(['line 1,line 2,line 3'])
})

test('applyEdits - issue with inserting multiple lines', () => {
  const editor = {
    uri: '/test/test.txt',
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
    id: 1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 32,
    finalY: 0,
    finalDeltaY: 0,
    height: 645,
    x: 0,
    y: 55,
    undoStack: [],
    validLines: [],
    invalidStartIndex: 3,
  }
  expect(
    TextDocument.applyEdits(editor, [
      {
        start: { rowIndex: 0, columnIndex: 0 },
        end: { rowIndex: 3, columnIndex: 6 },
        inserted: ['line 1', 'line 2', 'line 3'],
        deleted: ['line 1', 'line 2', 'line 3'],
        origin: EditOrigin.EditorPasteText,
      },
    ]),
  ).toEqual(['line 1', 'line 2', 'line 3'])
})

test('applyEdits - insert multiline snippet', () => {
  const editor = {
    lines: ['  '],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      start: {
        rowIndex: 0,
        columnIndex: 2,
      },
      end: {
        rowIndex: 0,
        columnIndex: 2,
      },
      inserted: ['<div>', '    test', '  </div>'],
      deleted: [''],
      origin: EditOrigin.EditorSnippet,
    },
  ])
  expect(newLines).toEqual(['  <div>', '    test', '  </div>'])
})

test('applyEdits - replace multiple lines', () => {
  const editor = {
    lines: ['h1 {', '  font-size: 20px', '}'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 3,
        columnIndex: 0,
      },
      inserted: ['h1 {', '  font-size: 20px;', '}', ''],
      deleted: ['h1 {', '  font-size: 20px', '}'],
      origin: EditOrigin.Format,
    },
  ])
  expect(newLines).toEqual(['h1 {', '  font-size: 20px;', '}', ''])
})

test('applyEdits - replace multiple lines', () => {
  const editor = {
    lines: ['h1 {', '  font-size: 20px', '}'],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 3,
        columnIndex: 0,
      },
      inserted: ['h1 {', '  font-size: 20px;', '}', ''],
      deleted: ['h1 {', '  font-size: 20px', '}'],
      origin: EditOrigin.Format,
    },
  ])
  expect(newLines).toEqual(['h1 {', '  font-size: 20px;', '}', ''])
})

test('applyEdits - two lines deleted and two lines inserted', () => {
  const editor = {
    lines: ['b', 'a', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
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
    undoStack: [],
  }
  const newLines = TextDocument.applyEdits(editor, [
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 0,
      },
      inserted: ['a', 'b', ''],
      deleted: ['b', ''],
      origin: EditOrigin.Unknown,
    },
    {
      start: {
        rowIndex: 1,
        columnIndex: 0,
      },
      end: {
        rowIndex: 2,
        columnIndex: 0,
      },
      inserted: [''],
      deleted: ['a', ''],
      origin: EditOrigin.Unknown,
    },
  ])
  expect(newLines).toEqual(['a', 'b', ''])
})
