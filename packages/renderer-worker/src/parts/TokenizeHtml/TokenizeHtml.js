import * as Assert from '../Assert/Assert.ts'
import * as TokenType from '../HtmlTokenType/HtmlTokenType.js'
import { UnexpectedTokenError } from '../UnexpectedTokenError/UnexpectedTokenError.js'

const State = {
  TopLevelContent: 1,
  AfterOpeningAngleBracket: 2,
  InsideOpeningTag: 3,
  AfterClosingTagSlash: 4,
  AfterClosingTagName: 5,
  InsideOpeningTagAfterWhitespace: 6,
  AfterAttributeName: 7,
  AfterAttributeEqualSign: 8,
  InsideAttributeAfterDoubleQuote: 9,
  AfterAttributeValueInsideDoubleQuote: 10,
  AfterAttributeValueClosingQuote: 11,
  AfterExclamationMark: 16,
  InsideComment: 17,
}

const RE_ANGLE_BRACKET_OPEN = /^</
const RE_ANGLE_BRACKET_OPEN_TAG = /^<(?![\s!\%])/
const RE_ANGLE_BRACKET_CLOSE = /^>/
const RE_SLASH = /^\//
const RE_TAGNAME = /^[a-zA-Z\d$]+/
const RE_CONTENT = /^[^<>]+/
const RE_WHITESPACE = /^\s+/
const RE_ATTRIBUTE_NAME = /^[a-zA-Z\d\-]+/
const RE_EQUAL_SIGN = /^=/
const RE_DOUBLE_QUOTE = /^"/
const RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE = /^[^"\n]+/
const RE_TEXT = /^[^<>]+/
const RE_EXCLAMATION_MARK = /^!/
const RE_DASH_DASH = /^--/
const RE_DOCTYPE = /^doctype/i
const RE_BLOCK_COMMENT_CONTENT = /^[a-zA-Z\s]+/
const RE_COMMENT_END = /^-->/
const RE_TAG_TEXT = /^[^\s>]+/
const RE_ANY_TEXT = /^[^\n]+/
const RE_BLOCK_COMMENT_START = /^<!--/
const RE_BLOCK_COMMENT_CONTENT_1 = /^.+?(?=-->)/s
const RE_BLOCK_COMMENT_CONTENT_2 = /^.+$/s
const RE_BLOCK_COMMENT_END = /^-->/
const RE_SELF_CLOSING = /^\/>/

/**
 * @param {string} text
 */
export const tokenizeHtml = (text) => {
  Assert.string(text)
  let state = State.TopLevelContent
  let index = 0
  let next
  const tokens = []
  let token = TokenType.None
  while (index < text.length) {
    const part = text.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_ANGLE_BRACKET_OPEN_TAG))) {
          token = TokenType.OpeningAngleBracket
          state = State.AfterOpeningAngleBracket
        } else if ((next = part.match(RE_CONTENT))) {
          token = TokenType.Content
          state = State.TopLevelContent
        } else if ((next = part.match(RE_BLOCK_COMMENT_START))) {
          token = TokenType.CommentStart
          state = State.InsideComment
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.Content
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANGLE_BRACKET_OPEN))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterOpeningAngleBracket:
        if ((next = part.match(RE_TAGNAME))) {
          token = TokenType.TagNameStart
          state = State.InsideOpeningTag
        } else if ((next = part.match(RE_SLASH))) {
          token = TokenType.ClosingTagSlash
          state = State.AfterClosingTagSlash
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.WhitespaceAfterOpeningTagOpenAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_EXCLAMATION_MARK))) {
          token = TokenType.ExclamationMark
          state = State.AfterExclamationMark
        } else if ((next = part.match(RE_ANY_TEXT))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          text.slice(index) // ?
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterExclamationMark:
        if ((next = part.match(RE_DASH_DASH))) {
          token = TokenType.StartCommentDashes
          state = State.InsideComment
        } else if ((next = part.match(RE_DOCTYPE))) {
          token = TokenType.Doctype
          state = State.InsideOpeningTag
        } else {
          text.slice(index) // ?
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideComment:
        if ((next = part.match(RE_BLOCK_COMMENT_CONTENT))) {
          token = TokenType.Comment
          state = State.InsideComment
        } else if ((next = part.match(RE_COMMENT_END))) {
          token = TokenType.EndCommentTag
          state = State.TopLevelContent
        } else {
          text.slice(index) // ?
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideOpeningTag:
        if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.WhitespaceInsideOpeningTag
          state = State.InsideOpeningTagAfterWhitespace
        } else if ((next = part.match(RE_TAG_TEXT))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideOpeningTagAfterWhitespace:
        if ((next = part.match(RE_ATTRIBUTE_NAME))) {
          token = TokenType.AttributeName
          state = State.AfterAttributeName
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_SELF_CLOSING))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_TEXT))) {
          token = TokenType.AttributeName
          state = State.AfterAttributeName
        } else {
          text.slice(index).match(RE_TEXT) // ?
          text.slice(index) // ?
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterAttributeName:
        if ((next = part.match(RE_EQUAL_SIGN))) {
          token = TokenType.AttributeEqualSign
          state = State.AfterAttributeEqualSign
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.WhitespaceInsideOpeningTag
          state = State.InsideOpeningTagAfterWhitespace
        } else if ((next = part.match(RE_ANGLE_BRACKET_OPEN))) {
          token = TokenType.OpeningAngleBracket
          state = State.AfterOpeningAngleBracket
        } else {
          text.slice(index) // ?
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterAttributeEqualSign:
        if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.AttributeQuoteStart
          state = State.InsideAttributeAfterDoubleQuote
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.InsideAttributeAfterDoubleQuote:
        if ((next = text.slice(index).match(RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE))) {
          token = TokenType.AttributeValue
          state = State.AfterAttributeValueInsideDoubleQuote
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.AttributeQuoteEnd
          state = State.AfterAttributeValueClosingQuote
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterAttributeValueInsideDoubleQuote:
        if ((next = part.match(RE_DOUBLE_QUOTE))) {
          token = TokenType.AttributeQuoteEnd
          state = State.AfterAttributeValueClosingQuote
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterAttributeValueClosingQuote:
        if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.WhitespaceInsideOpeningTag
          state = State.InsideOpeningTagAfterWhitespace
        } else if ((next = part.match(RE_SELF_CLOSING))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterClosingTagSlash:
        if ((next = part.match(RE_TAGNAME))) {
          token = TokenType.TagNameEnd
          state = State.AfterClosingTagName
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.WhitespaceAfterClosingTagSlash
          state = State.TopLevelContent
        } else if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      case State.AfterClosingTagName:
        if ((next = part.match(RE_ANGLE_BRACKET_CLOSE))) {
          token = TokenType.ClosingAngleBracket
          state = State.TopLevelContent
        } else if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Content
          state = State.TopLevelContent
        } else {
          throw new UnexpectedTokenError()
        }
        break
      default:
        throw new UnexpectedTokenError()
    }
    const tokenText = next[0]
    tokens.push({
      type: token,
      text: tokenText,
    })
    index += tokenText.length
  }
  return tokens
}
