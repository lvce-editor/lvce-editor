import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Tokenizer/Tokenizer.js', () => {
  return {
    getTokenizer: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GetTokensViewport = await import('../src/parts/GetTokensViewport/GetTokensViewport.js')
const Tokenizer = await import('../src/parts/Tokenizer/Tokenizer.js')
const TokenizePlainText = await import('../src/parts/TokenizePlainText/TokenizePlainText.js')

test('getTokensViewport', () => {
  const editor = {
    lines: ['1', '2', '3'],
    tokenizer: TokenizePlainText,
    lineCache: [],
    invalidStartIndex: 0,
  }
  const startLineIndex = 0
  const endLineIndex = 3
  // @ts-ignore
  Tokenizer.getTokenizer.mockImplementation(() => {
    return TokenizePlainText
  })
  expect(GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)).toEqual({
    embeddedResults: [],
    tokenizersToLoad: [],
    tokens: [
      {
        state: 1,
        tokens: [1, 1],
      },
      {
        state: 1,
        tokens: [1, 1],
      },
      {
        state: 1,
        tokens: [1, 1],
      },
    ],
  })
})

test.skip('getTokensViewport - determine embedded languages', () => {
  const defaultTokenizer = {
    initialLineState: {},
    TokenMap: {
      0: 'A',
      1: 'Embedded',
    },
    hasArrayReturn: true,
    tokenizeLine(line) {
      switch (line) {
        case 'A':
          return {
            tokens: [0, 1],
            embeddedLanguage: 'a',
            state: 1,
            embeddedLanguageStart: 0,
            embeddedLanguageEnd: 1,
          }
        case 'B':
          return {
            tokens: [0, 1],
            embeddedLanguage: 'b',
            state: 1,
            embeddedLanguageStart: 0,
            embeddedLanguageEnd: 1,
          }
        case 'C':
          return {
            tokens: [0, 1],
            embeddedLanguage: 'c',
            state: 1,
            embeddedLanguageStart: 0,
            embeddedLanguageEnd: 1,
          }
        default:
          throw new Error(`unexpected line ${line}`)
      }
    },
  }
  const editor = {
    lines: ['A', 'B', 'C'],
    tokenizer: defaultTokenizer,
    lineCache: [],
    invalidStartIndex: 0,
  }
  const startLineIndex = 0
  const endLineIndex = 3
  // @ts-ignore
  Tokenizer.getTokenizer.mockImplementation(() => {
    return TokenizePlainText
  })
  expect(GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)).toEqual({
    embeddedResults: [
      {
        TokenMap: [],
        isFull: false,
        result: {},
      },
      {
        TokenMap: [],
        isFull: false,
        result: {},
      },
      {
        TokenMap: [],
        isFull: false,
        result: {},
      },
    ],
    tokenizersToLoad: ['a', 'b', 'c'],
    tokens: [
      {
        embeddedLanguage: 'a',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 0,
        state: 1,
        tokens: [0, 1],
      },
      {
        embeddedLanguage: 'b',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 1,
        state: 1,
        tokens: [0, 1],
      },
      {
        embeddedLanguage: 'c',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 2,
        state: 1,
        tokens: [0, 1],
      },
    ],
  })
})

test.skip('getTokensViewport - tokenize with embedded language', () => {
  const defaultTokenizer = {
    initialLineState: {},
    TokenMap: {
      0: 'A',
      1: 'Embedded',
    },
    tokenizeLine(line) {
      switch (line) {
        case 'A':
          return {
            tokens: [0, 1],
            embeddedLanguage: 'a',
            state: 1,
            embeddedLanguageStart: 0,
            embeddedLanguageEnd: 1,
          }
        default:
          throw new Error(`unexpected line ${line}`)
      }
    },
    hasArrayReturn: true,
  }
  const editor = {
    lines: ['A'],
    tokenizer: defaultTokenizer,
    lineCache: [],
    invalidStartIndex: 0,
  }
  const startLineIndex = 0
  const endLineIndex = 1
  const testTokenizer = {
    hasArrayReturn: true,
    TokenMap: {
      0: 'A',
    },
    tokenizeLine: jest.fn((line) => {
      switch (line) {
        case 'A':
          return {
            tokens: [0, 1],
            state: 1,
          }
        default:
          throw new Error('unexpected line')
      }
    }),
  }
  // @ts-ignore
  Tokenizer.getTokenizer.mockImplementation((languageId) => {
    switch (languageId) {
      case 'a':
        return testTokenizer
      default:
        throw new Error('unexpected language id')
    }
  })
  expect(GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)).toEqual({
    embeddedResults: [
      {
        TokenMap: {
          0: 'A',
        },
        isFull: true,
        result: {
          state: 1,
          tokens: [0, 1],
        },
      },
    ],
    tokenizersToLoad: [],
    tokens: [
      {
        embeddedLanguage: 'a',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 0,
        state: 1,
        tokens: [0, 1],
      },
    ],
  })
  expect(testTokenizer.tokenizeLine).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(testTokenizer.tokenizeLine).toHaveBeenCalledWith('A', undefined)
})

test.skip('getTokensViewport - tokenize with embedded language and empty lines', () => {
  const defaultTokenizer = {
    initialLineState: {},
    TokenMap: {
      0: 'A',
      1: 'Embedded',
    },
    tokenizeLine(line) {
      switch (line) {
        case 'A':
          return {
            tokens: [0, line.length],
            state: 1,
          }
        case 'B':
        case '':
          return {
            tokens: [0, line.length],
            embeddedLanguage: 'b',
            state: 1,
            embeddedLanguageStart: 0,
            embeddedLanguageEnd: line.length,
          }
        default:
          throw new Error(`unexpected line ${line}`)
      }
    },
    hasArrayReturn: true,
  }
  const editor = {
    lines: ['A', 'B', '', 'B', 'A'],
    tokenizer: defaultTokenizer,
    lineCache: [],
    invalidStartIndex: 0,
  }
  const startLineIndex = 0
  const endLineIndex = 4
  const tokenizerB = {
    hasArrayReturn: true,
    TokenMap: {
      0: 'B',
    },
    tokenizeLine: jest.fn((line) => {
      switch (line) {
        case 'B':
          return {
            // @ts-ignore
            tokens: [0, line.length],
            state: 1,
          }
        case '':
          return {
            tokens: [0],
            state: 1,
          }
        default:
          throw new Error('unexpected line')
      }
    }),
    initialLineState: {},
  }
  // @ts-ignore
  Tokenizer.getTokenizer.mockImplementation((languageId) => {
    switch (languageId) {
      case 'b':
        return tokenizerB
      default:
        throw new Error('unexpected language id')
    }
  })
  expect(GetTokensViewport.getTokensViewport(editor, startLineIndex, endLineIndex)).toEqual({
    embeddedResults: [
      {
        TokenMap: {
          0: 'B',
        },
        isFull: true,
        result: {
          state: 1,
          tokens: [0, 1],
        },
      },
      {
        TokenMap: [],
        isFull: true,
        result: {
          tokens: [],
        },
      },
      {
        TokenMap: {
          0: 'B',
        },
        isFull: true,
        result: {
          state: 1,
          tokens: [0, 1],
        },
      },
    ],
    tokenizersToLoad: [],
    tokens: [
      {
        state: 1,
        tokens: [0, 1],
      },
      {
        embeddedLanguage: 'b',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 0,
        state: 1,
        tokens: [0, 1],
      },
      {
        embeddedLanguage: 'b',
        embeddedLanguageEnd: 0,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 1,
        state: 1,
        tokens: [0, 0],
      },
      {
        embeddedLanguage: 'b',
        embeddedLanguageEnd: 1,
        embeddedLanguageStart: 0,
        embeddedResultIndex: 2,
        state: 1,
        tokens: [0, 1],
      },
    ],
  })
  expect(tokenizerB.tokenizeLine).toHaveBeenCalledTimes(2)
  // @ts-ignore
  expect(tokenizerB.tokenizeLine).toHaveBeenNthCalledWith(1, 'B', {})
  // @ts-ignore
  expect(tokenizerB.tokenizeLine).toHaveBeenNthCalledWith(2, 'B', {
    state: 1,
    tokens: [0, 1],
  })
})
