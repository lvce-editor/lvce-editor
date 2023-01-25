import * as BabelParser from '../BabelParser/BabelParser.js'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'
import * as GetLineAndColumn from '../GetLineAndColumn/GetLineAndColumn.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsBabelParseError from '../IsBabelParseError/IsBabelParseError.js'

const RE_LINE_COLUMN = /(.*)(?:\(\d+\:\d+\))/

const getBabelErrorMessage = (message) => {
  const match = message.match(RE_LINE_COLUMN)
  if (match) {
    return match[1].trim()
  }
  return message
}

const restoreBabelError = (url, error) => {
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

const getDependencies = (code, ast) => {
  const { program } = ast
  const { body } = program
  const dependencies = []
  for (const node of body) {
    if (node.type === 'ImportDeclaration') {
      const relativePath = node.source.extra.rawValue
      const start = node.source.start
      const end = node.source.end
      dependencies.push({ relativePath, code, start, end })
    }
  }
  return dependencies
}

class NotFoundError extends Error {
  constructor(url) {
    super(`Failed to import ${url}: Not found (404)`)
    this.name = 'NotFoundError'
  }
}

class DependencyNotFoundError extends Error {
  constructor(code, start, end, dependencyRelativePath, dependencyUrl) {
    super(`dependency not found ${dependencyRelativePath}`)
    const { line, column } = GetLineAndColumn.getLineAndColumn(code, start, end)
    this.stack = `dependency not found ${dependencyRelativePath}
    at ${dependencyUrl}:${line}:${column}`
  }
}

const getErrorInDependencies = async (url, dependencies) => {
  for (const dependency of dependencies) {
    const dependencyUrl = new URL(dependency.relativePath, url).toString()
    // let dependencyResponse
    // try {
    const dependencyResponse = await fetch(dependencyUrl)
    // } catch (error) {}
    if (dependencyResponse.ok) {
      await tryToGetActualErrorMessage(null, dependencyUrl, dependencyResponse)
    } else {
      switch (dependencyResponse.status) {
        case HttpStatusCode.NotFound:
          throw new DependencyNotFoundError(dependency.code, dependency.start, dependency.end, dependency.relativePath, dependencyUrl)
        default:
          break
        // return `Failed to import ${url}: ${error}`
      }
    }
  }
}
/**
 *
 * @param {string} url
 * @param {Response} response
 * @returns
 */
export const tryToGetActualErrorMessage = async (error, url, response) => {
  console.log({ error })
  let text
  try {
    text = await response.text()
  } catch (error) {
    console.log({ error, url })
    return `Failed to import ${url}: Unknown Network Error`
  }
  let ast
  try {
    ast = BabelParser.parse(text, {
      sourceType: 'module',
    })
  } catch (error) {
    if (IsBabelParseError.isBabelError(error)) {
      return restoreBabelError(error)
    }
    throw error
  }
  const dependencies = getDependencies(text, ast)
  await getErrorInDependencies(url, dependencies)
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  return `Failed to import ${url}: Unknown Network Error`
}
