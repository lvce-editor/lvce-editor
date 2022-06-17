import * as EditorSelectCharacterRight from '../src/parts/EditorCommand/EditorCommandSelectCharacterRight.js'

test('editorSelectCharacterRight - no selection', () => {
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
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
  })
})

test.skip('editorSelectCharacterRight - no selection and at end of line', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },

    selections: [],
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 6,
        },
        end: {
          rowIndex: 1,
          columnIndex: 1,
        },
      },
    ],
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
  })
})

test.skip('editorSelectCharacterRight - has selection - single line', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
      },
    ],
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 2,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 2,
    },
  })
})

test.skip('editorSelectCharacterRight - has selection - nothing more to select', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 2,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 2,
          columnIndex: 1,
        },
      },
    ],
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 2,
          columnIndex: 1,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 1,
    },
  })
})

test.skip('editorSelectCharacterRight - has selection - merge selections', () => {
  const editor = {
    lines: ['line 1', 'line 2', ''],
    cursor: {
      rowIndex: 1,
      columnIndex: 6,
    },

    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
      {
        start: {
          rowIndex: 1,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 6,
        },
      },
    ],
  }
  expect(
    EditorSelectCharacterRight.editorSelectCharacterRight(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 2,
          columnIndex: 1,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 1,
    },
  })
})
