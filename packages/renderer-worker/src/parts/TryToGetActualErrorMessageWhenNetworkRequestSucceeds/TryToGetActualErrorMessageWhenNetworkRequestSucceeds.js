import { BabelParseError } from '../BabelParseError/BabelParseError.js'
import * as BabelParser from '../BabelParser/BabelParser.js'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'
import { DependencyNotFoundError } from '../DependencyNotFoundError/DependencyNotFoundError.js'
import * as GetBabelAstDependencies from '../GetBabelAstDependencies/GetBabelAstDependencies.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsBabelParseError from '../IsBabelParseError/IsBabelParseError.js'
import * as Url from '../Url/Url.js'

const getErrorInDependencies = async (url, dependencies, seenDependencies) => {
  for (const dependency of dependencies) {
    const dependencyUrl = Url.getAbsoluteUrl(dependency.relativePath, url)
    if (seenDependencies.includes(dependencyUrl)) {
      continue
    }
    seenDependencies.push(dependencyUrl)
    // let dependencyResponse
    // try {
    const dependencyResponse = await fetch(dependencyUrl)
    // } catch (error) {}
    if (dependencyResponse.ok) {
      await tryToGetActualErrorMessageInternal(null, dependencyUrl, dependencyResponse, seenDependencies)
    } else {
      switch (dependencyResponse.status) {
        case HttpStatusCode.NotFound:
          throw new DependencyNotFoundError(dependency.code, dependency.start, dependency.end, dependency.relativePath, dependencyUrl, url)
        default:
          break
        // return `Failed to import ${url}: ${error}`
      }
    }
  }
}

const tryToGetActualErrorMessageInternal = async (error, url, response, seenDependencies) => {
  let text
  try {
    text = await response.text()
  } catch (error) {
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
  await getErrorInDependencies(url, dependencies, seenDependencies)
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  return `Failed to import ${url}: Unknown Network Error`
}

/**
 *
 * @param {string} url
 * @param {Response} response
 * @returns
 */
export const tryToGetActualErrorMessage = async (error, url, response) => {
  return tryToGetActualErrorMessageInternal(error, url, response, [])
}
