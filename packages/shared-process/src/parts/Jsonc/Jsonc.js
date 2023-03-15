import * as CharCode from '../JsoncCharCode/JsoncCharCode.js'
import * as TokenType from '../JsoncTokenType/JsoncTokenType.js'

const createScanner = (text) => {
  let offset = 0
  const length = text.length

  const scanValue = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.CurlyOpen:
          offset++
          return TokenType.CurlyOpen
        case CharCode.CurlyClose:
          offset++
          return TokenType.CurlyClose
        case CharCode.SquareOpen:
          offset++
          return TokenType.SquareOpen
        case CharCode.SquareClose:
          offset++
          return TokenType.SquareClose
        case CharCode.DoubleQuote:
          offset++
          return TokenType.DoubleQuote
        case CharCode.Comma:
          text.slice(offset) //?
          offset++
          return TokenType.Comma
        case CharCode.Zero:
        case CharCode.One:
        case CharCode.Two:
        case CharCode.Three:
        case CharCode.Four:
        case CharCode.Five:
        case CharCode.Six:
        case CharCode.Seven:
        case CharCode.Eight:
        case CharCode.Nine:
        case CharCode.Dot:
          offset++
          return TokenType.Numeric
        case CharCode.CarriageReturn:
        case CharCode.LineFeed:
        case CharCode.Tab:
        case CharCode.Space:
          offset++
          break
        case CharCode.Slash:
          return TokenType.Slash
        default:
          return TokenType.Literal
      }
    }
    return TokenType.Eof
  }

  const scanString = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.DoubleQuote) {
        break
      }
      offset++
    }
    offset++
    const start = offset
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.DoubleQuote) {
        break
      }
      offset++
    }
    const result = text.slice(start, offset)
    offset++
    return result
  }

  const scanPropertyName = () => {
    return scanString()
  }

  const scanPropertyColon = () => {
    const code = text.charCodeAt(offset)
    offset++
  }

  const goBack = (delta) => {
    offset -= delta
  }

  const scanNumber = () => {
    const start = offset
    outer: while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.Zero:
        case CharCode.One:
        case CharCode.Two:
        case CharCode.Three:
        case CharCode.Four:
        case CharCode.Five:
        case CharCode.Six:
        case CharCode.Seven:
        case CharCode.Eight:
        case CharCode.Nine:
        case CharCode.Dot:
          break
        default:
          break outer
      }
      offset++
    }
    const result = text.slice(start, offset)
    result
    return result
  }

  const scanLiteral = () => {
    const start = offset
    outer: while (offset < length) {
      const code = text.charCodeAt(offset)
      switch (code) {
        case CharCode.LineFeed:
        case CharCode.CarriageReturn:
        case CharCode.Tab:
        case CharCode.Space:
        case CharCode.Comma:
          break outer
        default:
          break
      }
      offset++
    }
    const result = text.slice(start, offset)
    return result
  }

  const scanBlockComment = () => {
    while (offset < length) {
      if (text.charCodeAt(offset) === CharCode.Star && text.charCodeAt(offset + 1) === CharCode.Slash) {
        break
      }
      offset++
    }
  }

  const scanLineComment = () => {
    while (offset < length) {
      const code = text.charCodeAt(offset)
      if (code === CharCode.LineFeed) {
        break
      }
      offset++
    }
  }

  const scanComment = () => {
    const code = text.charCodeAt(offset)
    switch (code) {
      case CharCode.Star:
        return scanBlockComment()
      case CharCode.Slash:
        return scanLineComment()
      default:
        break
    }
  }

  return {
    scanValue,
    scanPropertyName,
    scanPropertyColon,
    scanString,
    scanNumber,
    goBack,
    scanLiteral,
    scanComment,
    getOffset() {
      return offset
    },
  }
}

const parsePropertyName = (scanner) => {
  const propertyName = scanner.scanPropertyName()
  return propertyName
}

const parsePropertyColon = (scanner) => {
  scanner.scanPropertyColon()
}

const parseNumber = (scanner) => {
  scanner.goBack(1)
  const rawValue = scanner.scanNumber()
  const value = parseFloat(rawValue)
  return value
}

const parseObject = (scanner) => {
  const object = {}
  outer: while (true) {
    const token = scanner.scanValue()
    switch (token) {
      case TokenType.Eof:
      case TokenType.None:
      case TokenType.CurlyClose:
        break outer
      case TokenType.DoubleQuote:
        scanner.goBack(1)
        const propertyName = parsePropertyName(scanner)
        parsePropertyColon(scanner)
        const value = parseValue(scanner)
        object[propertyName] = value
      case TokenType.Comma:
        break
      case TokenType.Slash:
        parseComment(scanner)
        break
      default:
        break
    }
  }
  return object
}

const parseString = (scanner) => {
  scanner.goBack(1)
  const value = scanner.scanString()
  return value
}

const parseArray = (scanner) => {
  const array = []
  outer: while (true) {
    const token = scanner.scanValue()
    switch (token) {
      case TokenType.Eof:
      case TokenType.None:
      case TokenType.SquareClose:
        break outer
      case TokenType.Slash:
        scanner.scanComment()
        break
      default:
        scanner.goBack(1)
        const value = parseValue(scanner)
        array.push(value)
        break
      case TokenType.Comma:
        break
    }
  }
  return array
}

const parseLiteral = (scanner) => {
  const rawValue = scanner.scanLiteral()
  switch (rawValue) {
    case 'true':
      return true
    case 'false':
      return false
    case 'null':
      return null
    default:
      return undefined
  }
}

const parseComment = (scanner) => {
  scanner.scanComment()
}

const parseValue = (scanner) => {
  const token = scanner.scanValue()
  switch (token) {
    case TokenType.CurlyOpen:
      return parseObject(scanner)
    case TokenType.DoubleQuote:
      return parseString(scanner)
    case TokenType.Numeric:
      return parseNumber(scanner)
    case TokenType.SquareOpen:
      return parseArray(scanner)
    case TokenType.Literal:
      return parseLiteral(scanner)
    case TokenType.Slash:
      parseComment(scanner)
      return parseValue(scanner)
    default:
      token
      return undefined
  }
}

export const parse = (text) => {
  const scanner = createScanner(text)
  const result = parseValue(scanner)
  return result
}
