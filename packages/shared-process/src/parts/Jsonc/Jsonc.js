const RE_WHITESPACE = /^\s+/
const RE_LINE_COMMENT = /^\/\/.*/
const RE_CONTENT = /^.+/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_DOUBLE_QUOTE = /^\"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"\\]+/
const RE_NUMERIC = /^\d+/
const RE_ANYTHING = /^.+/
const RE_COLON = /^:/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/)/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_COMMA = /^,/

const State = {
  TopLevelContent: 1,
  InsideBlockComment: 2,
  InsideDoubleQuoteString: 3,
  InsideObject: 4,
  AfterPropertyName: 5,
  InsideArray: 6,
  AfterPropertyNameAfterColon: 7,
  AfterPropertyValue: 8,
}

class UnexpectedTokenError extends Error {
  constructor() {
    super('unexpected token')
  }
}

/**
 *
 * @param {string} content
 * @param {string} filePath
 * @returns
 */
export const parse = (content, filePath = '') => {
  let state = State.TopLevelContent
  let next
  let index = 0
  let contentIndex = 0
  let jsonContent = ''
  const stack = []
  while (index < content.length) {
    const part = content.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_CURLY_OPEN))) {
          state = State.InsideObject
          stack.push(State.InsideObject)
        } else if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else if ((next = part.match(RE_NUMERIC))) {
          // ignore
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = State.InsideDoubleQuoteString
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_CURLY_CLOSE))) {
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          // ignore
          contentIndex = index + next[0].length
        } else if ((next = part.match(RE_SQUARE_OPEN))) {
          state = State.InsideArray
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_BLOCK_COMMENT_START))) {
          state = State.InsideBlockComment
          stack.push(State.TopLevelContent)
        } else if ((next = part.match(RE_COMMA))) {
          state = stack.pop() || State.TopLevelContent
        } else {
          part
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideObject:
        if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = State.InsideDoubleQuoteString
          stack.push(State.AfterPropertyName)
        } else if ((next = part.match(RE_CURLY_CLOSE))) {
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          jsonContent += content.slice(contentIndex, index)
          contentIndex = index + next[0].length
        } else {
          stack
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterPropertyName:
        if ((next = part.match(RE_COLON))) {
          state = State.AfterPropertyNameAfterColon
          stack.push(State.AfterPropertyValue)
        } else if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterPropertyNameAfterColon:
        if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else if ((next = part.match(RE_NUMERIC))) {
          // ignore
          state = State.AfterPropertyValue
        } else if ((next = part.match(RE_SQUARE_OPEN))) {
          state = State.InsideArray
          // stack.push(State.AfterPropertyValue)
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = State.InsideDoubleQuoteString
          // stack.push(State.AfterPropertyValue)
        } else {
          part
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideArray:
        if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else if ((next = part.match(RE_CURLY_OPEN))) {
          stack.push(State.InsideArray)
          state = State.InsideObject
        } else if ((next = part.match(RE_NUMERIC))) {
          // ignore
        } else if ((next = part.match(RE_SQUARE_CLOSE))) {
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          jsonContent += content.slice(contentIndex, index)
          contentIndex = index + next[0].length
        } else if ((next = part.match(RE_SQUARE_OPEN))) {
          stack.push(State.InsideArray)
          state = State.InsideArray
        } else if ((next = part.match(RE_COMMA))) {
          // ignore
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          stack.push(State.InsideArray)
          state = State.InsideDoubleQuoteString
        } else {
          part
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideBlockComment:
        if ((next = part.match(RE_BLOCK_COMMENT_END))) {
          state = stack.pop() || State.TopLevelContent
          contentIndex = index + next[0].length
        } else if ((next = part.match(RE_BLOCK_COMMENT_CONTENT))) {
          state = State.InsideBlockComment
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterPropertyValue:
        if ((next = part.match(RE_COMMA))) {
          state = State.InsideObject
        } else if ((next = part.match(RE_CURLY_CLOSE))) {
          stack
          // stack.pop()
          state = stack.pop() || State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          // ignore
        } else {
          stack
          part
          throw new UnexpectedTokenError()
        }
        break
      default:
        state
        throw new Error('unexpected state')
    }
    // @ts-ignore
    index += next[0].length
  }
  jsonContent += content.slice(contentIndex)
  jsonContent
  const parsed = JSON.parse(jsonContent)
  return parsed
}
