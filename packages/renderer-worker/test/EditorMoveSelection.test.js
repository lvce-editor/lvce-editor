import * as EditorMoveSelection from '../src/parts/EditorCommand/EditorCommandMoveSelection.js'

test('editorMoveSelection', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 1,
  }
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 2,
      columnIndex: 2,
    })
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 2,
          columnIndex: 2,
        },
      },
    ],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
  })
})

test('editorMoveSelection - to the left', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 1,
  }
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 0,
    })
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

test('editorMoveSelection - anchor same as cursor position', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 1,
  }
  const editor = {
    lines: ['line 1', 'line 2', 'line 3'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 1,
  }
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 1,
    })
  ).toMatchObject({
    cursor: {
      rowIndex: 0,
      columnIndex: 1,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 1,
        },
        end: {
          rowIndex: 0,
          columnIndex: 1,
        },
        type: 1,
      },
    ],
  })
})

test.skip('editorMoveSelection - single line backwards selection', () => {
  const cursor = {
    rowIndex: 0,
    columnIndex: 4,
  }
  const editor = {
    lines: ['line 1'],
    cursor,
    selections: [
      {
        start: cursor,
        end: cursor,
      },
    ],
  }
  EditorMoveSelection.state.position = {
    rowIndex: 0,
    columnIndex: 4,
  }
  expect(
    EditorMoveSelection.editorMoveSelection(editor, {
      rowIndex: 0,
      columnIndex: 3,
    })
  ).toMatchObject({
    selections: [
      {
        end: {
          columnIndex: 4,
          rowIndex: 0,
        },
        start: {
          columnIndex: 3,
          rowIndex: 0,
        },
      },
    ],
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
  })
})
