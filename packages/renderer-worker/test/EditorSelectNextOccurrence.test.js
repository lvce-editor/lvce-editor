import * as EditorSelectNextOccurrence from '../src/parts/EditorCommand/EditorCommandSelectNextOccurrence.js'

test.skip('editorSelectNextOccurrence - no selection and no word at cursor position', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['  sample text'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  expect(EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)).toBe(
    editor
  )
})

test('editorSelectNextOccurrence - no selection and cursor position at start of word', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 0,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }

  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - no selection and cursor position at end of word', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - one selection and more selections possible after', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 1,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - one selection and more selections possible before', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 1,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 1,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 1,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - one selection and more selections possible in middle', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor: {
      rowIndex: 1,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 2,
          columnIndex: 0,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  // expect(newEditor.cursor).toEqual({
  //   rowIndex: 1,
  //   columnIndex: 4,
  // })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 1,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 2,
        columnIndex: 0,
      },
      end: {
        rowIndex: 2,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - one selection and more selections possible in middle in first line', () => {
  const editor = {
    lines: ['line 1 line 2 line 3', 'line 4', 'line 5'],
    cursor: {
      rowIndex: 1,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 0,
          columnIndex: 7,
        },
        end: {
          rowIndex: 0,
          columnIndex: 11,
        },
      },
      {
        start: {
          rowIndex: 2,
          columnIndex: 0,
        },
        end: {
          rowIndex: 2,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  // expect(newEditor.cursor).toEqual({
  //   rowIndex: 1,
  //   columnIndex: 4,
  // })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 0,
        columnIndex: 7,
      },
      end: {
        rowIndex: 0,
        columnIndex: 11,
      },
    },
    {
      start: {
        rowIndex: 0,
        columnIndex: 14,
      },
      end: {
        rowIndex: 0,
        columnIndex: 18,
      },
    },
    {
      start: {
        rowIndex: 2,
        columnIndex: 0,
      },
      end: {
        rowIndex: 2,
        columnIndex: 4,
      },
    },
  ])
})

test.skip('editorSelectNextOccurrence - one selection and more selections possible before in same line', () => {
  const editor = {
    lines: ['line 1 line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 11,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 7,
        },
        end: {
          rowIndex: 0,
          columnIndex: 11,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 11,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 0,
        columnIndex: 7,
      },
      end: {
        rowIndex: 0,
        columnIndex: 11,
      },
    },
  ])
})

test('editorSelectNextOccurrence - one selection and no more selections possible', () => {
  const editor = {
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - multiple selections and no more selections possible', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 1,
          columnIndex: 4,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 1,
        columnIndex: 0,
      },
      end: {
        rowIndex: 1,
        columnIndex: 4,
      },
    },
  ])
})

test('editorSelectNextOccurrence - multiple selections in same line and no more selections possible', () => {
  const editor = {
    lines: ['line 1 line 2'],
    cursor: {
      rowIndex: 0,
      columnIndex: 4,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 4,
        },
      },
      {
        start: {
          rowIndex: 0,
          columnIndex: 7,
        },
        end: {
          rowIndex: 0,
          columnIndex: 11,
        },
      },
    ],
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 4,
  })
  expect(newEditor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 4,
      },
    },
    {
      start: {
        rowIndex: 0,
        columnIndex: 7,
      },
      end: {
        rowIndex: 0,
        columnIndex: 11,
      },
    },
  ])
})
// TODO add tests when there is selection

// TODO add tests for single-line and multiline selection

// TODO test next occurrence at end of file (next occurrence is at start)

// TODO need many more tests

// TODO test some selections empty, some not empty

// TODO test some selections same word, some different word, some empty

// TODO test some single line selections, some multiline selections

test.skip('editorSelectNextOccurrence - new word out of viewport', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 11,
  }
  const editor = {
    lines: [
      'sample text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'other text',
      'sample text',
    ],
    cursor,
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 11,
        },
      },
    ],
    deltaY: 0,
    rowHeight: 20,
    height: 60,
    minLineY: 0,
    maxLineY: 3,
    finalDeltaY: 200,
  }
  const newEditor =
    EditorSelectNextOccurrence.editorSelectNextOccurrence(editor)
  expect(editor.selections).toEqual([
    {
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: 0,
        columnIndex: 11,
      },
    },
    {
      start: {
        rowIndex: 12,
        columnIndex: 0,
      },
      end: {
        rowIndex: 12,
        columnIndex: 11,
      },
    },
  ])
  expect(newEditor.deltaY).toBe(140) // scroll down by 7 lines
})
