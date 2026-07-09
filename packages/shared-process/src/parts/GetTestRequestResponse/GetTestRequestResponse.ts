import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as AddCustomPathsToIndexHtml from '../AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.ts'
import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.ts'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.ts'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.ts'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.ts'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.ts'
import * as GetContentResponse from '../GetContentResponse/GetContentResponse.ts'
import * as GetPathName from '../GetPathName/GetPathName.ts'
import * as GetTestPath from '../GetTestPath/GetTestPath.ts'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.ts'
import * as HttpHeader from '../HttpHeader/HttpHeader.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as Logger from '../Logger/Logger.ts'

export const getTestRequestResponse = async (request: any, indexHtmlPath: any): Promise<any> => {
  try {
    const pathName = GetPathName.getPathName(request)
    if (pathName === '/tests/_all.html') {
      const body = await readFile(indexHtmlPath, 'utf8')
      const content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(body)
      const headers = {
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
        [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
        [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
        [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.value,
        [HttpHeader.ContentType]: 'text/html',
      }
      return GetContentResponse.getContentResponse(content, headers)
    }
    if (pathName.endsWith('.html')) {
      const body = await readFile(indexHtmlPath, 'utf8')
      const content = await AddCustomPathsToIndexHtml.addCustomPathsToIndexHtml(body)
      const headers = {
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
        [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
        [HttpHeader.CrossOriginResourcePolicy]: CrossOriginResourcePolicy.value,
        [HttpHeader.ContentSecurityPolicy]: ContentSecurityPolicyDocument.value,
        [HttpHeader.ContentType]: 'text/html',
      }
      return GetContentResponse.getContentResponse(content, headers)
    }
    if (pathName === '/tests/' || pathName === '/tests') {
      const testPath = GetTestPath.getTestPath()
      const testPathSrc = join(testPath, 'src')
      const body = await CreateTestOverview.createTestOverview(testPathSrc)
      const headers = {
        [HttpHeader.CacheControl]: 'no-store',
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
        [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
        [HttpHeader.ContentSecurityPolicy]: "default-src 'none'",
        [HttpHeader.ContentType]: 'text/html',
      }
      return GetContentResponse.getContentResponse(body, headers)
    }
    return GetNotFoundResponse.getNotFoundResponse()
  } catch (error) {
    Logger.error(error)
    if (error.code === 'ENOENT') {
      return {
        body: 'Not Found',
        init: {
          status: HttpStatusCode.NotFound,
        },
      }
    }
    return {
      body: 'Internal server error',
      init: {
        status: HttpStatusCode.ServerError,
      },
    }
  }
}
