import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

/**
 * @enum {number}
 */
const State = {
  TopLevelContent: 0,
  AfterOpeningAngleBracket: 1,
  InsideTag: 2,
  AfterAttributeName: 3,
  AfterOpeningAngleBracketAfterSlash: 4,
  AfterAttributeNameAfterEqualSign: 5,
  InsideAttributeString: 6,
}

const RE_OPENING_ANGLE_BRACKET = /^</
const RE_CLOSING_ANGLE_BRACKET = /^>/
const RE_TEXT = /^[a-z\-]+/
const RE_WHITESPACE = /^\s+/
const RE_SLASH = /^\//
const RE_EQUAL_SIGN = /^=/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_CONTENT = /^[^"]+/
const RE_TEXT_CONTENT = /^[^<>]+/

const getType = (text) => {
  switch (text) {
    case 'div':
      return VirtualDomElements.Div
    case 'root':
      return VirtualDomElements.Root
    case 'i':
      return VirtualDomElements.I
    default:
      throw new Error('unknown html tag')
  }
}

const getAttributeName = (text) => {
  switch (text) {
    case 'class':
      return 'className'
    case 'aria-selected':
      return 'ariaSelected'
    default:
      return text
  }
}

const getAttributeValue = (text) => {
  switch (text) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      return text
  }
}

const getText = (text) => {
  return text.trim()
}

export const parse = (string) => {
  if (string === '') {
    return []
  }
  string = string.trim()
  let state = State.TopLevelContent
  let next
  let i = 0
  const dom = []
  let node = {
    type: 0,
    props: {},
    childCount: 0,
  }

  let attributeName = ''
  const stack = [
    {
      type: 0,
      props: {},
      childCount: 0,
    },
  ]
  while (i < string.length) {
    const part = string.slice(i)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_OPENING_ANGLE_BRACKET))) {
          state = State.AfterOpeningAngleBracket
        } else if ((next = part.match(RE_TEXT_CONTENT))) {
          const trimmed = next[0].trim()
          if (trimmed) {
            const parentNode = stack.at(-1)
            parentNode.childCount++
            dom.push({
              type: VirtualDomElements.Text,
              props: {
                text: getText(next[0]),
              },
              childCount: 0,
            })
          }
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      case State.AfterOpeningAngleBracket:
        if ((next = part.match(RE_TEXT))) {
          state = State.InsideTag
          const type = getType(next[0])
          const parentNode = stack.at(-1)
          parentNode.childCount++
          node = {
            type,
            props: {},
            childCount: 0,
          }
          dom.push(node)
        } else if ((next = part.match(RE_SLASH))) {
          state = State.AfterOpeningAngleBracketAfterSlash
        } else {
          throw new Error('no')
        }
        break
      case State.InsideTag:
        if ((next = part.match(RE_WHITESPACE))) {
          state = State.InsideTag
        } else if ((next = part.match(RE_TEXT))) {
          state = State.AfterAttributeName
          attributeName = getAttributeName(next[0])
        } else if ((next = part.match(RE_CLOSING_ANGLE_BRACKET))) {
          state = State.TopLevelContent
          stack.push(node)
        } else {
          throw new Error('no')
        }
        break
      case State.AfterOpeningAngleBracketAfterSlash:
        if ((next = part.match(RE_TEXT))) {
          state = State.AfterOpeningAngleBracketAfterSlash
        } else if ((next = part.match(RE_CLOSING_ANGLE_BRACKET))) {
          state = State.TopLevelContent
          stack.pop()
        } else {
          throw new Error('no')
        }
        break
      case State.AfterAttributeName:
        if ((next = part.match(RE_EQUAL_SIGN))) {
          state = State.AfterAttributeNameAfterEqualSign
        } else {
          throw new Error('no')
        }
        break
      case State.AfterAttributeNameAfterEqualSign:
        if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = State.InsideAttributeString
        } else {
          throw new Error('no')
        }
        break
      case State.InsideAttributeString:
        if ((next = part.match(RE_STRING_CONTENT))) {
          state = State.InsideAttributeString
          node.props[attributeName] = getAttributeValue(next[0])
        } else if ((next = part.match(RE_DOUBLE_QUOTE))) {
          state = State.InsideTag
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    // @ts-ignore
    i += next[0].length
  }
  return dom
}
