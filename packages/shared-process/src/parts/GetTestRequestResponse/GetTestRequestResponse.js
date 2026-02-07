import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as AddCustomPathsToIndexHtml from '../AddCustomPathsToIndexHtml/AddCustomPathsToIndexHtml.js'
import * as ContentSecurityPolicyDocument from '../ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as CrossOriginResourcePolicy from '../CrossOriginResourcePolicy/CrossOriginResourcePolicy.js'
import * as GetContentResponse from '../GetContentResponse/GetContentResponse.js'
import * as GetMultipleChoiceResponse from '../GetMultipleChoiceResponse/GetMultipleChoiceResponse.js'
import * as GetPathName from '../GetPathName/GetPathName.js'
import * as GetTestPath from '../GetTestPath/GetTestPath.js'
import * as GetNotFoundResponse from '../GetNotFoundResponse/GetNotFoundResponse.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as Logger from '../Logger/Logger.js'

export const getTestRequestResponse = async (request, indexHtmlPath) => {
  try {
    const pathName = GetPathName.getPathName(request)
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
        [HttpHeader.CacheControl]: 'public, max-age=0, must-revalidate',
        [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
        [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
        [HttpHeader.ContentSecurityPolicy]: "default-src 'none'",
        [HttpHeader.ContentType]: 'text/html',
      }
      return GetMultipleChoiceResponse.getMultipleChoiceResponse(body, headers)
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
