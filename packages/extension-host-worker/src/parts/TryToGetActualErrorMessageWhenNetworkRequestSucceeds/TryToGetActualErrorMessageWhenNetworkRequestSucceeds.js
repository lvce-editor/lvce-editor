import * as BabelParser from '../BabelParser/BabelParser.js'

const RE_LINE_COLUMN = /(.*)(?:\(\d+\:\d+\))/

const getBabelErrorMessage = (message) => {
  const match = message.match(RE_LINE_COLUMN)
  if (match) {
    return match[1].trim()
  }
  return message
}

const restoreBabelError = (url, error) => {
  // @ts-ignore
  if (error && error instanceof SyntaxError && error.code === 'BABEL_PARSER_SYNTAX_ERROR') {
    const message = getBabelErrorMessage(error.message)
    const betterError = new SyntaxError(message)
    // @ts-ignore
    const line = error.loc.line
    // @ts-ignore
    const column = error.loc.column + 1
    betterError.stack = `${message}
  at ${url}:${line}:${column}`
    throw betterError
  }
  return `Failed to import ${url}: Unknown Error: ${error}`
}

/**
 *
 * @param {string} url
 * @param {Response} response
 * @returns
 */
export const tryToGetActualErrorMessage = async (error, url, response) => {
  try {
    const text = await response.text()
    BabelParser.parse(text, {
      sourceType: 'module',
    })
    return `Failed to import ${url}: Unknown Network Error`
  } catch (babelError) {
    return restoreBabelError(url, babelError)
  }
}
