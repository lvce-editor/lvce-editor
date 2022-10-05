/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterCurlyOpen: 2,
  InsideString: 3,
  AfterPropertyName: 4,
  AfterPropertyNameAfterColon: 5,
  AfterPropertyValue: 6,
  JsonPropertyKey: 7,
  InsideLineComment: 8,
  InsidePropertyNameString: 9,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
  [State.AfterCurlyOpen]: 'AfterCurlyOpen',
  [State.InsideString]: 'InsideString',
  [State.AfterPropertyName]: 'AfterPropertyName',
  [State.AfterPropertyNameAfterColon]: 'AfterPropertyNameAfterColon',
  [State.AfterPropertyValue]: 'AfterPropertyValue',
  [State.JsonPropertyKey]: 'JsonPropertyKey',
}

/**
 * @enum number
 */
export const TokenType = {
  CssSelector: 1,
  Whitespace: 2,
  Punctuation: 3,
  PropertyName: 4,
  PropertyValue: 5,
  CurlyOpen: 6,
  CurlyClose: 7,
  PropertyColon: 8,
  PropertySemicolon: 9,
  String: 10,
  LanguageConstant: 11,
  NewLine: 12,
  JsonPropertyName: 13,
  PropertyValueString: 14,
  Numeric: 15,
  LanguageConstantBoolean: 16,
  Comment: 17,
  Error: 18,
  Unknown: 19,
  Text: 20,
  JsonPropertyValueString: 21,
}

export const TokenMap = {
  [TokenType.CssSelector]: 'CssSelector',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.PropertyName]: 'PropertyName',
  [TokenType.PropertyValue]: 'PropertyValue',
  [TokenType.CurlyOpen]: 'CurlyOpen',
  [TokenType.CurlyClose]: 'CurlyClose',
  [TokenType.PropertyColon]: 'PropertyColon',
  [TokenType.PropertySemicolon]: 'PropertySemicolon',
  [TokenType.String]: 'String',
  [TokenType.LanguageConstant]: 'LanguageConstant',
  [TokenType.LanguageConstantBoolean]: 'LanguageConstantBoolean',
  [TokenType.JsonPropertyName]: 'JsonPropertyName',
  [TokenType.PropertyValueString]: 'PropertyValueString',
  [TokenType.Comment]: 'Comment',
  [TokenType.Error]: 'Error',
  [TokenType.Unknown]: 'Unknown',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Text]: 'Text',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.JsonPropertyValueString]: 'JsonPropertyValueString',
}

const RE_SELECTOR = /^[\.a-zA-Z\d\-\:>]+/
const RE_WHITESPACE = /^\s+/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[a-zA-Z\-]+/
const RE_COLON = /^:/
const RE_PROPERTY_VALUE = /^[^\n;]+/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"\\]+/
const RE_LANGUAGE_CONSTANT = /^(?:true|false|null)/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_LINE_COMMENT = /^\/\/.*/
const RE_ANYTHING = /^.+/s
const RE_NUMERIC =
  /^((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)\b/
const RE_TEXT = /^[^\s\{\}\[\]]+/
const RE_ESCAPED_QUOTE = /^\\"/
const RE_BACK_SLASH = /^\\/

export const initialLineState = {
  state: State.TopLevelContent,
  stack: [],
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next
  let index = 0
  let token
  let state = lineState.state
  let __r = 0
  const tokens = []
  const stack = lineState.stack
  state
  while (index < line.length) {
    if (__r++ > 100_000_000_000) {
      throw new Error('endless loop')
    }
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_CURLY_OPEN))) {
          token = TokenType.Punctuation
          state = State.AfterCurlyOpen
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_SQUARE_OPEN))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_SQUARE_CLOSE))) {
          token = TokenType.Punctuation
          state = stack.pop()
        } else if ((next = part.match(RE_COMMA))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LANGUAGE_CONSTANT))) {
          token = TokenType.LanguageConstant
          state = State.TopLevelContent
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.InsideString
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.InsideLineComment
        } else if ((next = part.match(RE_CURLY_CLOSE))) {
          token = TokenType.CurlyClose
          state = stack.pop()
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.AfterCurlyOpen:
        part
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterCurlyOpen
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.InsidePropertyNameString
          stack.push(State.AfterPropertyName)
        } else if ((next = part.match(RE_CURLY_CLOSE))) {
          token = TokenType.Punctuation
          state = stack.pop()
          if (!state) {
            throw new Error('imbalanced json')
          }
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.AfterCurlyOpen
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsidePropertyNameString:
        if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.JsonPropertyName
          state = State.InsidePropertyNameString
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = stack.pop()
          state
        } else if ((next = part.match(RE_ESCAPED_QUOTE))) {
          token = TokenType.JsonPropertyName
          state = State.InsidePropertyNameString
        } else if ((next = part.match(RE_BACK_SLASH))) {
          token = TokenType.JsonPropertyName
          state = State.InsidePropertyNameString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideString:
        if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.JsonPropertyValueString
          state = State.InsideString
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = stack.pop()
        } else if ((next = part.match(RE_ESCAPED_QUOTE))) {
          token = TokenType.String
          state = State.InsideString
        } else if ((next = part.match(RE_BACK_SLASH))) {
          token = TokenType.String
          state = State.InsideString
        } else {
          line.slice(0, index) //?
          part //?
          throw new Error('no')
        }
        break
      case State.AfterPropertyName:
        if ((next = part.match(RE_COLON))) {
          token = TokenType.Punctuation
          state = State.AfterPropertyNameAfterColon
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterPropertyName
        } else if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Text
          state = State.AfterCurlyOpen
        } else {
          throw new Error('no')
        }
        break
      case State.AfterPropertyNameAfterColon:
        part
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterPropertyNameAfterColon
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.Punctuation
          state = State.InsideString
          stack.push(State.AfterPropertyValue)
        } else if ((next = part.match(RE_LANGUAGE_CONSTANT))) {
          token = TokenType.LanguageConstant
          state = State.AfterPropertyValue
        } else if ((next = part.match(RE_NUMERIC))) {
          token = TokenType.Numeric
          state = State.AfterPropertyValue
        } else if ((next = part.match(RE_TEXT))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else if ((next = part.match(RE_CURLY_OPEN))) {
          token = TokenType.Punctuation
          state = State.AfterCurlyOpen
          stack.push(State.AfterPropertyValue)
        } else if ((next = part.match(RE_SQUARE_OPEN))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
          stack.push(State.AfterPropertyValue)
        } else {
          line.slice(0, index) //?
          throw new Error('no')
        }
        break
      case State.AfterPropertyValue:
        if ((next = part.match(RE_CURLY_CLOSE))) {
          token = TokenType.Punctuation
          state = stack.pop()
          if (!state) {
            throw new Error('inbalanced json')
          }
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.AfterPropertyValue
        } else if ((next = part.match(RE_COMMA))) {
          token = TokenType.Punctuation
          state = State.AfterCurlyOpen
        } else {
          part //?
          throw new Error('no')
        }
        break
      case State.InsideLineComment:
        if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        state
        throw new Error('no')
    }

    const currentTokenText = next[0]
    const currentTokenLength = currentTokenText.length
    index += currentTokenLength
    tokens.push(token, currentTokenLength)
  }
  if (state === State.InsideLineComment) {
    state = State.TopLevelContent
  }
  return {
    state,
    stack,
    tokens,
  }
}
