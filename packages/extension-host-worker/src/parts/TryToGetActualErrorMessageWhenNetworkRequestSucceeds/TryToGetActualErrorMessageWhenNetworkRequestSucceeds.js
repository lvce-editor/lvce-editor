import { BabelParseError } from '../BabelParseError/BabelParseError.js'
import * as BabelParser from '../BabelParser/BabelParser.js'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'
import { DependencyNotFoundError } from '../DependencyNotFoundError/DependencyNotFoundError.js'
import * as GetBabelAstDependencies from '../GetBabelAstDependencies/GetBabelAstDependencies.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsBabelParseError from '../IsBabelParseError/IsBabelParseError.js'

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
      throw new BabelParseError(url, error)
    }
    throw error
  }
  const dependencies = GetBabelAstDependencies.getBabelAstDependencies(text, ast)
  await getErrorInDependencies(url, dependencies)
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  return `Failed to import ${url}: Unknown Network Error`
}
