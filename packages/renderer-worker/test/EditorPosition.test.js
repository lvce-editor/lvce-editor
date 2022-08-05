import * as EditorPosition from '../src/parts/EditorCommand/EditorCommandPosition.js'

test('x', () => {
  const editor = {
    lines: ['line 1', 'line 2'],
    cursor: {
      rowIndex: 1,
      columnIndex: 1,
    },
    top: 0,
    left: 5,
    columnWidth: 8,
    rowHeight: 20,
  }
  expect(EditorPosition.x(editor, 1, 1)).toBe(13)
})

test('y', () => {
  const editor = {
    lines: [''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    top: 0,
    left: 0,
    columnWidth: 8,
    rowHeight: 20,
  }
  expect(EditorPosition.y(editor, 0, 0)).toBe(20)
})
