import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    getLanguageConfiguration: jest.fn(() => {
      throw new Error('not implemented')
    }),
    hasLoaded: jest.fn(() => true),
    getLanguageId: jest.fn(() => 'test'),
    waitForLoad: jest.fn(),
  }
})

const EditorToggleBlockComment = await import(
  '../src/parts/EditorCommand/EditorCommandToggleBlockComment.js'
)
const Languages = await import('../src/parts/Languages/Languages.js')

test('comment with block comment', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {
      comments: {
        blockComment: ['<!--', '-->'],
      },
    }
  })
  const editor = {
    lines: ['  <body>', '    sample test', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 15,
    },
    languageId: 'html',
    lineCache: [],
    selections: [],
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 15, // TODO should be at 22
    },
  })
})

test('uncomment block comment', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {
      comments: {
        blockComment: ['<!--', '-->'],
      },
    }
  })
  const editor = {
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 22,
    },
    lineCache: [],
    selections: [],
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    sample test', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 22, // TODO should be at 15
    },
  })
})

test('uncomment multiline block comment', async () => {
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return {
      comments: {
        blockComment: ['<!--', '-->'],
      },
    }
  })
  const editor = {
    lines: ['  <body>', '    <!--sample test', '-->', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 20,
    },
    lineCache: [],
    selections: [],
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    sample test', '', '  </body>'],
    cursor: {
      rowIndex: 1,
      columnIndex: 20,
    },
  })
})
