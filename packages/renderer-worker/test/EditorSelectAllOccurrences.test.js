import * as EditorSelectAllOccurrences from '../src/parts/EditorCommand/EditorCommandSelectAllOccurrences.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'

test('editorSelectAllOccurrences - single line selection', () => {
  const editor = {
    lines: ['sample text, sample text'],
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorSelectAllOccurrences.editorSelectAllOccurrences(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
      {
        start: {
          rowIndex: 0,
          columnIndex: 13,
        },
        end: {
          rowIndex: 0,
          columnIndex: 18,
        },
      },
    ],
  })
})

test('editorSelectAllOccurrences - single line selection - no more to add', () => {
  const editor = {
    lines: ['sample text'],
    cursor: {
      rowIndex: 0,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorSelectAllOccurrences.editorSelectAllOccurrences(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 0,
        },
        end: {
          rowIndex: 0,
          columnIndex: 5,
        },
      },
    ],
  })
  // TODO test that renderProcess.send has not been called since selection has not been modified
})

test('editorSelectAllOccurrences - no selections, but word at cursor position exists', () => {
  const editor = {
    lines: ['sample text, sample text'],
    cursor: {
      rowIndex: 0,
      columnIndex: 6,
    },
    selections: [],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorSelectAllOccurrences.editorSelectAllOccurrences(editor)
  ).toMatchObject({
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
          rowIndex: 0,
          columnIndex: 13,
        },
        end: {
          rowIndex: 0,
          columnIndex: 19,
        },
      },
    ],
  })
})

test('editorSelectAllOccurrences - no selections and no word at cursor position', () => {
  const editor = {
    lines: ['before         after'],
    cursor: {
      rowIndex: 0,
      columnIndex: 10,
    },
    selections: [],
    tokenizer: TokenizePlainText,
  }
  expect(
    EditorSelectAllOccurrences.editorSelectAllOccurrences(editor)
  ).toMatchObject({
    selections: [],
  })
})

test('editorSelectAllOccurrences - multi line selection', () => {
  const editor = {
    lines: ['sample text', 'sample text', 'sample text'],
    cursor: {
      rowIndex: 1,
      columnIndex: 5,
    },
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 7,
        },
        end: {
          rowIndex: 1,
          columnIndex: 6,
        },
      },
    ],
  }
  expect(
    EditorSelectAllOccurrences.editorSelectAllOccurrences(editor)
  ).toMatchObject({
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 7,
        },
        end: {
          rowIndex: 1,
          columnIndex: 6,
        },
      },
      {
        start: {
          rowIndex: 1,
          columnIndex: 7,
        },
        end: {
          rowIndex: 2,
          columnIndex: 6,
        },
      },
    ],
  })
})

// TODO test for ambiguous multiline match
