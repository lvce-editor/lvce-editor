import { jest } from '@jest/globals'
import { editorShowMessage } from '../src/parts/EditorCommand/EditorCommandShowMessage.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Languages/Languages.js', () => {
  return {
    getLanguageConfiguration: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js',
  () => {
    return {
      editorShowMessage: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const EditorToggleComment = await import(
  '../src/parts/EditorCommand/EditorCommandToggleComment.js'
)

const Languages = await import('../src/parts/Languages/Languages.js')
const EditorShowMessage = await import(
  '../src/parts/EditorCommand/EditorCommandShowMessage.js'
)

const LANGUAGE_CONFIGURATION_JAVASCRIPT = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
}

const LANGUAGE_CONFIGURATION_HTML_INVALID = {
  comments: {
    blockComment: ['<!--', '-->'],
  },
}

const LANGUAGE_CONFIGURATION_HTML = {
  comments: {
    blockComment: ['<!--', '-->'],
  },
}

test('comment line', async () => {
  const editor = {
    lines: ['const x = 1'],
    languageId: 'javascript',
    selections: new Uint32Array([0, 0, 0, 0]),
    uri: '',
    undoStack: [],
  }
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_JAVASCRIPT
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  expect(newEditor.lines).toEqual(['// const x = 1'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 3, 0, 3]))
})

test('uncomment line', async () => {
  const editor = {
    lines: ['// const x = 1'],
    languageId: 'javascript',
    selections: new Uint32Array([0, 3, 0, 3]),
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_JAVASCRIPT
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  expect(newEditor.lines).toEqual(['const x = 1'])
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
})

test('uncomment line, no space after comment', async () => {
  const editor = {
    lines: ['//const x = 1'],
    languageId: 'javascript',
    selections: new Uint32Array([0, 3, 0, 3]),
    undoStack: [],
    uri: '',
  }

  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_JAVASCRIPT
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  expect(newEditor).toMatchObject({
    lines: ['const x = 1'],
    languageId: 'javascript',
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test.skip('comment line with block comment - error - block comment configuration is invalid', async () => {
  const editor = {
    lines: ['<h1></h1>'],
    languageId: 'html',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    undoStack: [],
  }
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_HTML_INVALID
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  // TODO should not apply block comment in this case when it is invalid
  expect(newEditor.lines).toEqual(['undefined <h1></h1> -->'])
})

test('comment line - error - loading language configuration', async () => {
  const editor = {
    lines: ['const x = 1'],
    languageId: 'javascript',
    selections: new Uint32Array([0, 0, 0, 0]),
    uri: '',
    undoStack: [],
  }
  // @ts-ignore
  EditorShowMessage.editorShowMessage.mockImplementation(() => {})
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(await EditorToggleComment.toggleComment(editor)).toBe(editor)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledTimes(1)
  expect(EditorShowMessage.editorShowMessage).toHaveBeenCalledWith(
    editor,
    0,
    0,
    'TypeError: x is not a function',
    true
  )
})

test.skip('comment line with block comment', async () => {
  const editor = {
    lines: ['<h1></h1>'],
    languageId: 'html',
    selections: new Uint32Array([0, 0, 0, 0]),
    undoStack: [],
    uri: '',
  }
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_HTML
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  // TODO there should be a space after the comment
  expect(newEditor.lines).toEqual(['<!--<h1></h1>-->'])
  // TODO adjust cursor index
  expect(newEditor.selections).toEqual(new Uint32Array([0, 0, 0, 0]))
})

test.skip('uncomment line with block comment', async () => {
  const editor = {
    lines: ['<!-- <h1></h1> -->'],
    languageId: 'html',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },

    uri: '',
    undoStack: [],
  }
  // @ts-ignore
  Languages.getLanguageConfiguration.mockImplementation(() => {
    return LANGUAGE_CONFIGURATION_HTML
  })
  const newEditor = await EditorToggleComment.toggleComment(editor)
  expect(newEditor.lines).toEqual([' <h1></h1> '])
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    // TODO adjust cursor index
    columnIndex: 0,
  })
})
