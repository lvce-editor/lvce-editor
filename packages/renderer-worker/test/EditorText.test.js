import * as EditorText from '../src/parts/Editor/EditorText.js'

test('getVisible', () => {
  const editor = {
    uri: '',
    languageId: 'html',
    lines: ['<h1>hello world</h1>'],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    completionTriggerCharacters: [],
    selections: [],
    decorations: [],
    id: 1,
    tokenizer: {
      StateMap: {},
      TokenMap: {
        0: 'Whitespace',
        10: 'Punctuation',
        11: 'PunctuationString',
        30: 'Numeric',
        50: 'String',
        60: 'Comment',
        117: 'Text',
        118: 'TagName',
        119: 'AttributeName',
        141: 'Error',
        228: 'PunctuationTag',
        99999999: 'None',
      },
      TokenType: {
        None: 99999999,
        Numeric: 30,
        String: 50,
        Whitespace: 0,
        Comment: 60,
        Text: 117,
        PunctuationTag: 228,
        TagName: 118,
        AttributeName: 119,
        Punctuation: 10,
        Error: 141,
        PunctuationString: 11,
        NewLine: 891,
      },
      initialLineState: {
        state: 1,
      },
    },
    deltaY: 0,
    minLineY: 0,
    maxLineY: 1,
    numberOfVisibleLines: 20,
    finalY: 0,
    finalDeltaY: 0,
    height: 400,
    top: 20,
    left: 0,
    columnWidth: 9.735,
    rowHeight: 20,
    scrollBarHeight: 40,
    undoStack: [],
    lineCache: [
      // TODO why is null here?
      null,
      {
        state: 1,
        tokens: [
          {
            type: 228,
            length: 1,
          },
          {
            type: 118,
            length: 2,
          },
          {
            type: 228,
            length: 1,
          },
          {
            type: 117,
            length: 11,
          },
          {
            type: 228,
            length: 1,
          },
          {
            type: 228,
            length: 1,
          },
          {
            type: 118,
            length: 2,
          },
          {
            type: 228,
            length: 1,
          },
        ],
      },
    ],
    validLines: [],
    invalidStartIndex: 1,
  }
  expect(EditorText.getVisible(editor)).toEqual([
    [
      '<',
      'Token PunctuationTag',
      'h1',
      'Token TagName',
      '>',
      'Token PunctuationTag',
      'hello world',
      'Token Text',
      '<',
      'Token PunctuationTag',
      '/',
      'Token PunctuationTag',
      'h1',
      'Token TagName',
      '>',
      'Token PunctuationTag',
    ],
  ])
})

test('getVisible - with semantic tokens decorations', () => {
  const editor = {
    uri: '/test/add.js',
    languageId: 'javascript',
    lines: ['const add = (a, b) => a + b;', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 28,
    },
    completionTriggerCharacters: [],
    selections: [
      {
        start: {
          rowIndex: 0,
          columnIndex: 28,
        },
        end: {
          rowIndex: 0,
          columnIndex: 28,
        },
      },
    ],
    id: 1,
    tokenizer: {
      TokenMap: {
        10: 'Punctuation',
        11: 'PunctuationString',
        13: 'LanguageConstant',
        14: 'Regex',
        30: 'Numeric',
        50: 'String',
        60: 'Comment',
        117: 'Text',
        118: 'TagName',
        119: 'AttributeName',
        141: 'Error',
        228: 'PunctuationTag',
        771: 'NewLine',
        777: 'Whitespace',
        951: 'Keyword',
        952: 'VariableName',
        99999999: 'None',
      },
      TokenType: {
        None: 99999999,
        Numeric: 30,
        String: 50,
        Whitespace: 777,
        Comment: 60,
        Text: 117,
        PunctuationTag: 228,
        TagName: 118,
        AttributeName: 119,
        Punctuation: 10,
        Error: 141,
        PunctuationString: 11,
        NewLine: 771,
        Keyword: 951,
        VariableName: 952,
        LanguageConstant: 13,
        Regex: 14,
      },
      initialLineState: {
        state: 1,
      },
    },
    deltaY: 0,
    minLineY: 0,
    maxLineY: 2,
    numberOfVisibleLines: 22,
    finalY: 0,
    finalDeltaY: 0,
    height: 449,
    top: 55,
    left: 0,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
    lineCache: [
      null,
      {
        state: 1,
        tokens: [
          {
            type: 951,
            length: 5,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 3,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
        ],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    validLines: [],
    invalidStartIndex: 2,
    // prettier-ignore
    decorations: [
      6 /* offset */,
      3 /* length */,
      2825, /* (2825 >> 8) - 1 = 10 = function, 2825 & 255 = 9 = 2^3 + 2^0 = declaration and readonly */

      13, /* offset */
      1, /* length */
      1793, /* (1793 >> 8) - 1 = 6 = parameter, 1793 & 255 = 1 = 2^0 = declaration  */

      16,/* offset */
      1, /* length */
      1793, /* (1793 >> 8) - 1 = 6 = parameter, 1793 & 255 = 1 = 2^0 = declaration  */

      22, /* offset */
      1, /* length */
      1792, /* (1792 >> 8) - 1 = 6 = parameter, 1792 & 255 = 0 = none */

      26, /* offset */
      1, /* length */
      1792, /*  (1792 >> 8) - 1 = 6 = parameter, 1792 & 255 = 0 = none */
    ],
  }
  expect(EditorText.getVisible(editor)).toEqual([
    [
      'const',
      'Token Keyword',
      ' ',
      'Token Whitespace',
      'add',
      'Token Function',
      ' ',
      'Token Whitespace',
      '=',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '(',
      'Token Punctuation',
      'a',
      'Token Parameter',
      ',',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'b',
      'Token Parameter',
      ')',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '=',
      'Token Punctuation',
      '>',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'a',
      'Token Parameter',
      ' ',
      'Token Whitespace',
      '+',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'b',
      'Token Parameter',
      ';',
      'Token Punctuation',
    ],
    [],
  ])
})

test('getVisible - with multi-line semantic tokens decorations', () => {
  const editor = {
    uri: '/test/playground/add.js',
    languageId: 'javascript',
    lines: ['const add = (a, b) => a + b;', '', 'add(1,2,3)', ''],
    cursor: {
      rowIndex: 0,
      columnIndex: 0,
    },
    completionTriggerCharacters: [],
    selections: [],
    id: 1,
    tokenizer: {
      TokenMap: {
        10: 'Punctuation',
        11: 'PunctuationString',
        13: 'LanguageConstant',
        14: 'Regex',
        30: 'Numeric',
        50: 'String',
        60: 'Comment',
        117: 'Text',
        118: 'TagName',
        119: 'AttributeName',
        141: 'Error',
        228: 'PunctuationTag',
        771: 'NewLine',
        777: 'Whitespace',
        951: 'Keyword',
        952: 'VariableName',
        99999999: 'None',
      },
      TokenType: {
        None: 99999999,
        Numeric: 30,
        String: 50,
        Whitespace: 777,
        Comment: 60,
        Text: 117,
        PunctuationTag: 228,
        TagName: 118,
        AttributeName: 119,
        Punctuation: 10,
        Error: 141,
        PunctuationString: 11,
        NewLine: 771,
        Keyword: 951,
        VariableName: 952,
        LanguageConstant: 13,
        Regex: 14,
      },
      initialLineState: {
        state: 1,
      },
    },
    deltaY: 0,
    minLineY: 0,
    maxLineY: 4,
    numberOfVisibleLines: 22,
    finalY: 0,
    finalDeltaY: 0,
    height: 449,
    top: 55,
    left: 0,
    columnWidth: 9,
    rowHeight: 20,
    fontSize: 15,
    letterSpacing: 0.5,
    scrollBarHeight: 0,
    undoStack: [],
    lineCache: [
      null,
      {
        state: 1,
        tokens: [
          {
            type: 951,
            length: 5,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 3,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 777,
            length: 1,
          },
          {
            type: 952,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
        ],
      },
      {
        state: 1,
        tokens: [],
      },
      {
        state: 1,
        tokens: [
          {
            type: 952,
            length: 3,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 30,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 30,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
          {
            type: 30,
            length: 1,
          },
          {
            type: 10,
            length: 1,
          },
        ],
      },
      {
        state: 1,
        tokens: [],
      },
    ],
    validLines: [],
    invalidStartIndex: 4,
    // prettier-ignore
    decorations: [
      6 /* offset */,
      3 /* length */,
      2825, /* (2825 >> 8) - 1 = 10 = function, 2825 & 255 = 9 = 2^3 + 2^0 = declaration and readonly */

      13, /* offset */
      1, /* length */
      1793, /* (1793 >> 8) - 1 = 6 = parameter, 1793 & 255 = 1 = 2^0 = declaration  */

      16,/* offset */
      1, /* length */
      1793, /* (1793 >> 8) - 1 = 6 = parameter, 1793 & 255 = 1 = 2^0 = declaration  */

      22, /* offset */
      1, /* length */
      1792, /* (1792 >> 8) - 1 = 6 = parameter, 1792 & 255 = 0 = none */

      26, /* offset */
      1, /* length */
      1792, /*  (1792 >> 8) - 1 = 6 = parameter, 1792 & 255 = 0 = none */

      30, /* offset */
      3, /* length */
      2824, /* (2824 >> 8) -1 = 10 = function, 2824 & 255 = 8 = 2^3 = readonly  */
    ],
  }
  expect(EditorText.getVisible(editor)).toEqual([
    [
      'const',
      'Token Keyword',
      ' ',
      'Token Whitespace',
      'add',
      'Token Function',
      ' ',
      'Token Whitespace',
      '=',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '(',
      'Token Punctuation',
      'a',
      'Token Parameter',
      ',',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'b',
      'Token Parameter',
      ')',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      '=',
      'Token Punctuation',
      '>',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'a',
      'Token Parameter',
      ' ',
      'Token Whitespace',
      '+',
      'Token Punctuation',
      ' ',
      'Token Whitespace',
      'b',
      'Token Parameter',
      ';',
      'Token Punctuation',
    ],
    [],
    [
      'add',
      'Token Function',
      '(',
      'Token Punctuation',
      '1',
      'Token Numeric',
      ',',
      'Token Punctuation',
      '2',
      'Token Numeric',
      ',',
      'Token Punctuation',
      '3',
      'Token Numeric',
      ')',
      'Token Punctuation',
    ],
    [],
  ])
})
