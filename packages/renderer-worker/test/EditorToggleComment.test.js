import { jest } from '@jest/globals'
import * as EditorToggleComment from '../src/parts/EditorCommand/EditorCommandToggleComment.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as TokenizePlainText from '../src/parts/Tokenizer/TokenizePlainText.js'
import * as Languages from '../src/parts/Languages/Languages.js'

beforeAll(() => {
  Languages.state.loaded = true
})

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

test.skip('comment line', async () => {
  const editor = {
    lines: ['const x = 1'],
    languageId: 'javascript',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    tokenizer: TokenizePlainText,
    uri: '',
    undoStack: [],
  }
  Languages.state.languages = [
    {
      id: 'javascript',
      extensions: ['.js'],
      tokenize: 'src/tokenizeJavaScript.js',
      configuration: './languageConfiguration.json',
    },
  ]
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_JAVASCRIPT,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  expect(newEditor.lines).toEqual(['// const x = 1'])
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 3,
  })
})

test.skip('uncomment line', async () => {
  const editor = {
    lines: ['// const x = 1'],
    languageId: 'javascript',
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
    tokenizer: TokenizePlainText,
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_JAVASCRIPT,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  expect(newEditor.lines).toEqual(['const x = 1'])
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    columnIndex: 0,
  })
})

test.skip('uncomment line, no space after comment', async () => {
  const editor = {
    lines: ['//const x = 1'],
    languageId: 'javascript',
    cursor: {
      rowIndex: 0,
      columnIndex: 3,
    },
    tokenizer: TokenizePlainText,
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_JAVASCRIPT,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  expect(newEditor).toMatchObject({
    lines: ['const x = 1'],
    languageId: 'unknown',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
  })
})

test.skip('comment line with block comment - error block comment configuration is invalid', async () => {
  SharedProcess.state.send = jest.fn()
  const editor = {
    lines: ['<h1></h1>'],
    languageId: 'html',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    undoStack: [],
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_HTML_INVALID,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  // TODO should not apply block comment in this case when it is invalid
  expect(newEditor.lines).toEqual(['undefined <h1></h1> -->'])
})

test.skip('comment line with block comment', async () => {
  SharedProcess.state.send = jest.fn()
  const editor = {
    lines: ['<h1></h1>'],
    languageId: 'html',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    undoStack: [],
    uri: '',
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_HTML,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  // TODO there should be a space after the comment
  expect(newEditor.lines).toEqual(['<!--<h1></h1>-->'])
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    // TODO adjust cursor index
    columnIndex: 0,
  })
})

test.skip('uncomment line with block comment', async () => {
  const editor = {
    lines: ['<!-- <h1></h1> -->'],
    languageId: 'html',
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },

    tokenizer: TokenizePlainText,
    uri: '',
    undoStack: [],
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ExtensionHost.getLanguageConfiguration':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: LANGUAGE_CONFIGURATION_HTML,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const newEditor = await EditorToggleComment.editorToggleComment(editor)
  expect(newEditor.lines).toEqual([' <h1></h1> '])
  expect(newEditor.cursor).toEqual({
    rowIndex: 0,
    // TODO adjust cursor index
    columnIndex: 0,
  })
})
