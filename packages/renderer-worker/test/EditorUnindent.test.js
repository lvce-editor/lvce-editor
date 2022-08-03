import { jest } from '@jest/globals'
import * as EditorUnindent from '../src/parts/EditorCommandUnIndent/EditorCommandUnindent.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test.skip('editorUnindent - no selection - single line', () => {
  const editor = {
    lines: ['  line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 8,
    },
    selections: [],
    tokenizer: TokenizePlainText,
  }
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 6,
  })
})

test.skip('editorUnindent - no selection - single line - nothing to do', () => {
  const editor = {
    lines: ['line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [],
    tokenizer: TokenizePlainText,
  }
  RendererProcess.state.send = jest.fn()
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1'])
  expect(editor.selections).toEqual([])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 6,
  })
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test.skip('editorUnindent - unindent one selection - single line', () => {
  const editor = {
    lines: ['  line 1'],
    cursor: {
      rowIndex: 0,
      columnIndex: 8,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 8,
        },
      },
    ],
    tokenizer: TokenizePlainText,
  }
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1'])
  expect(editor.selections).toEqual([
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
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 6,
  })
})

test.skip('editorUnindent - unindent multiple selections on single line', () => {
  const editor = {
    lines: ['  line 1 line 2 line 3'],
    cursor: {
      rowIndex: 0,
      columnIndex: 22,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 2,
        },
        end: {
          rowIndex: 0,
          columnIndex: 8,
        },
      },
      {
        start: {
          rowIndex: 0,
          columnIndex: 9,
        },
        end: {
          rowIndex: 0,
          columnIndex: 15,
        },
      },
      {
        start: {
          rowIndex: 0,
          columnIndex: 16,
        },
        end: {
          rowIndex: 0,
          columnIndex: 22,
        },
      },
    ],
    tokenizer: TokenizePlainText,
  }
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1 line 2 line 3'])
  expect(editor.selections).toEqual([
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
        rowIndex: 0,
        columnIndex: 7,
      },
      end: {
        rowIndex: 0,
        columnIndex: 13,
      },
    },
    {
      start: {
        rowIndex: 0,
        columnIndex: 14,
      },
      end: {
        rowIndex: 0,
        columnIndex: 20,
      },
    },
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 20,
  })
})

test.skip('editorUnindent - unindent one selection spanning multiple lines', () => {
  const editor = {
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
    cursor: {
      rowIndex: 2,
      columnIndex: 2,
    },
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
    ],
    tokenizer: TokenizePlainText,
  }
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 4'])
  expect(editor.selections).toEqual([
    {
      start: {
        rowIndex: 1,
        columnIndex: 1,
      },
      end: {
        rowIndex: 2,
        columnIndex: 2,
      },
    },
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 2,
  })
})

test.skip('editorUnindent - unindent one selection spanning multiple lines but start and end line cannot be indented', () => {
  const editor = {
    lines: ['line 1', '  line 2', '  line 3', 'line 4'],
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
    tokenizer: TokenizePlainText,
  }
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 4'])
  expect(editor.selections).toEqual([
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
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 3,
    columnIndex: 6,
  })
})

test('editorUnindent - unindent one selection spanning multiple lines - nothing to do', () => {
  const editor = {
    lines: ['line 1', 'line 2', 'line 3', 'line 4'],
    cursor: {
      rowIndex: 2,
      columnIndex: 4,
    },
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
    ],
    tokenizer: TokenizePlainText,
  }
  RendererProcess.state.send = jest.fn()
  EditorUnindent.editorUnindent(editor)
  expect(editor.lines).toEqual(['line 1', 'line 2', 'line 3', 'line 4'])
  expect(editor.selections).toEqual([
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
  ])
  expect(editor.cursor).toEqual({
    rowIndex: 2,
    columnIndex: 4,
  })
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})
