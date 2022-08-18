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
    selections: new Uint32Array([1, 15, 1, 15]),
    languageId: 'html',
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    <!--sample test-->', '  </body>'],
    // TODO should be at 22
    selections: new Uint32Array([1, 15, 1, 15]),
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
    selections: new Uint32Array([1, 22, 1, 22]),
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    sample test', '  </body>'],
    // TODO should be at 15
    selections: new Uint32Array([1, 22, 1, 22]),
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
    selections: new Uint32Array([1, 20, 1, 20]),
    lineCache: [],
    undoStack: [],
    uri: '',
  }
  expect(
    await EditorToggleBlockComment.editorToggleBlockComment(editor)
  ).toMatchObject({
    lines: ['  <body>', '    sample test', '', '  </body>'],
    selections: new Uint32Array([1, 20, 1, 20]),
  })
})
