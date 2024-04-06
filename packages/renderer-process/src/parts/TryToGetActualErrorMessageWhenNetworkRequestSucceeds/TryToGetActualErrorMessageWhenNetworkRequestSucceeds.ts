import { BabelParseError } from '../BabelParseError/BabelParseError.ts'
import * as BabelParser from '../BabelParser/BabelParser.ts'
import * as BabelSourceType from '../BabelSourceType/BabelSourceType.ts'
import { ContentSecurityPolicyError } from '../ContentSecurityPolicyError/ContentSecurityPolicyError.ts'
import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'
import { DependencyNotFoundError } from '../DependencyNotFoundError/DependencyNotFoundError.ts'
import * as GetBabelAstDependencies from '../GetBabelAstDependencies/GetBabelAstDependencies.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as IsBabelParseError from '../IsBabelParseError/IsBabelParseError.ts'
import * as Url from '../Url/Url.ts'

const isExternal = (url) => {
  if (url.startsWith('/')) {
    return false
  }
  if (url.startsWith(location.protocol)) {
    return false
  }
  return true
}

const isNpmDependency = (relativePath) => {
  return relativePath.startsWith('@') && relativePath.includes('/')
}

const getErrorInDependencies = async ({ url, dependencies, workerName, seenUrls }) => {
  for (const dependency of dependencies) {
    if (isNpmDependency(dependency.relativePath)) {
      throw new DependencyNotFoundError(dependency.code, dependency.start, dependency.end, dependency.relativePath, '', url)
    }
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
      // @ts-expect-error
      await tryToGetActualErrorMessage({ url: dependencyUrl, response: dependencyResponse, seenUrls, workerName })
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
 * @param {{error?:any, url:string, response?:Response, workerName?:string, seenUrls?:[]}} options
 * @returns
 */
export const tryToGetActualErrorMessage = async ({ error, url, response, workerName, seenUrls = [] }) => {
  let text
  try {
    text = await response.text()
  } catch {
    if (workerName) {
      return `Failed to start ${workerName}: Unknown Network Error (${response.status})`
    }
    return `Failed to import ${url}: Unknown Network Error (${response.status})`
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
  await getErrorInDependencies({ url, dependencies, seenUrls, workerName })
  if (ContentSecurityPolicyErrorState.hasRecentErrors()) {
    const recentError = ContentSecurityPolicyErrorState.getRecentError()
    // @ts-expect-error
    throw new ContentSecurityPolicyError(recentError.violatedDirective, recentError.sourceFile, recentError.lineNumber, recentError.columnNumber)
  }
  if (workerName) {
    return `Failed to start ${workerName}: Unknown Network Error (${response.status})`
  }
  return `Failed to import ${url}: Unknown Network Error (${response.status})`
}
