import { BabelParseError } from '../BabelParseError/BabelParseError.js'
import * as BabelParser from '../BabelParser/BabelParser.js'
import * as BabelSourceType from '../BabelSourceType/BabelSourceType.js'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.js'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.js'
import { DependencyNotFoundError } from '../DependencyNotFoundError/DependencyNotFoundError.js'
import * as GetBabelAstDependencies from '../GetBabelAstDependencies/GetBabelAstDependencies.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as IsBabelParseError from '../IsBabelParseError/IsBabelParseError.js'
import * as Url from '../Url/Url.js'

const isExternal = (url) => {
  if (url.startsWith('/')) {
    return false
  }
  if (url.startsWith(location.protocol)) {
    return false
  }
  return true
}

const getErrorInDependencies = async (url, dependencies, seenUrls) => {
  for (const dependency of dependencies) {
    const dependencyUrl = Url.getAbsoluteUrl(dependency.relativePath, url)
    if (isExternal(dependencyUrl) || seenUrls.includes(dependencyUrl)) {
      continue
    }
    seenUrls.push(dependencyUrl)
    // let dependencyResponse
    // try {
    const dependencyResponse = await fetch(dependencyUrl)
    // } catch (error) {}
    if (dependencyResponse.ok) {
      await tryToGetActualErrorMessage(null, dependencyUrl, dependencyResponse, seenUrls)
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

/**
 *
 * @param {string} url
 * @param {Response} response
 * @returns
 */
export const tryToGetActualErrorMessage = async (error, url, response, seenUrls = []) => {
  let text
  try {
    text = await response.text()
  } catch (error) {
    return `Failed to import ${url}: Unknown Network Error`
  }
  let ast
  try {
    ast = await BabelParser.parse(text, {
      sourceType: BabelSourceType.Module,
    })
  } catch (error) {
    if (IsBabelParseError.isBabelError(error)) {
      throw new BabelParseError(url, error)
    }
    throw error
  }
  const dependencies = GetBabelAstDependencies.getBabelAstDependencies(text, ast)
  await getErrorInDependencies(url, dependencies, seenUrls)
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  const contentType = response.headers.get('Content-Type')
  if (url.endsWith('.js') && contentType === null) {
    return `Failed to import ${url}: Missing Content-Type header for javascript`
  }
  return `Failed to import ${url}: Unknown Network Error`
}
