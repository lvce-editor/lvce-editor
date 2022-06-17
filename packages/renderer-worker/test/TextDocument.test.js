import * as TextDocument from '../src/parts/TextDocument/TextDocument.js'

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
    ])
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
    ])
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
    ])
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
    ])
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
    ])
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
        origin: 'insertLineBreak',
      },
    ])
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
        deleted: [],
        origin: 'toggleBlockComment',
      },
      {
        start: { rowIndex: 1, columnIndex: 20 },
        end: { rowIndex: 1, columnIndex: 20 },
        inserted: ['-->'],
        deleted: [],
        origin: 'toggleBlockComment',
      },
    ])
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
        origin: 'toggleBlockComment',
      },
    ])
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
        inserted: [],
        deleted: ['<!--'],
        origin: 'toggleBlockComment',
      },
      {
        start: { rowIndex: 1, columnIndex: 15 },
        end: { rowIndex: 1, columnIndex: 18 },
        inserted: [],
        deleted: ['-->'],
        origin: 'toggleBlockComment',
      },
    ])
  ).toEqual(['  <body>', '    sample test', '  </body>'])
})
test('applyEdits - deletions in multiple lines', () => {
  const textDocument = {
    lines: ['  <body>', '    <!--sample test', '-->', '  </body>'],
  }
  expect(
    TextDocument.applyEdits(textDocument, [
      {
        start: { rowIndex: 1, columnIndex: 4 },
        end: { rowIndex: 1, columnIndex: 8 },
        inserted: [],
        deleted: ['<!--'],
        origin: 'toggleBlockComment',
      },
      {
        start: { rowIndex: 2, columnIndex: 0 },
        end: { rowIndex: 2, columnIndex: 3 },
        inserted: [],
        deleted: ['-->'],
        origin: 'toggleBlockComment',
      },
    ])
  ).toEqual(['  <body>', '    sample test', '', '  </body>'])
})

test('positionAt - in first line', () => {
  expect(
    TextDocument.positionAt(
      {
        lines: ['11111', '22222'],
      },
      4
    )
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
      5
    )
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
      6
    )
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
        inserted: [...Array(150_000).fill('a')],
        deleted: [''],
      },
    ])
  ).toEqual([...Array(150_000).fill('a')])
})

test('applyEdits - virtual space', () => {
  const textDocument = {
    uri: '/tmp/foo-dQ1pOm/test.txt',
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
    top: 55,
    left: 0,
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
        origin: 'editorPasteText',
      },
    ])
  ).toEqual(['line 1,line 2,line 3'])
})

test('applyEdits - issue with inserting multiple lines', () => {
  const editor = {
    uri: '/tmp/foo-ScUYJ4/test.txt',
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
    top: 55,
    left: 0,
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
        origin: 'editorPasteText',
      },
    ])
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
      origin: 'editorSnippet',
    },
  ])
  expect(newLines).toEqual(['  <div>', '    test', '  </div>'])
})
