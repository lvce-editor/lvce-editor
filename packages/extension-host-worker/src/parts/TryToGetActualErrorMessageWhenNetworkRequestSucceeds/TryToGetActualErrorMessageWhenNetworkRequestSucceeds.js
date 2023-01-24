import * as BabelParser from '../BabelParser/BabelParser.js'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'

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
  let text
  try {
    text = await response.text()
  } catch (error) {
    return `Failed to import ${url}: Unknown Network Error`
  }
  try {
    BabelParser.parse(text, {
      sourceType: 'module',
    })
  } catch (error) {
    return restoreBabelError(url, error)
  }
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  return `Failed to import ${url}: Unknown Network Error`
}
