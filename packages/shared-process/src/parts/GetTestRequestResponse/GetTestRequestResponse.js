import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'
import * as HttpHeader from '../HttpHeader/HttpHeader.js'
import * as GetPathName from '../GetPathName/GetPathName.js'
import * as GetTestPath from '../GetTestPath/GetTestPath.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getTestRequestResponse = async (request, indexHtmlPath) => {
  const pathName = GetPathName.getPathName(request)
  if (pathName.endsWith('.html')) {
    const body = await readFile(indexHtmlPath, 'utf8')
    return {
      body,
      init: {
        status: HttpStatusCode.Ok,
        headers: {},
      },
    }
  }
  if (pathName === '/tests/') {
    const testPath = GetTestPath.getTestPath()
    const testPathSrc = join(testPath, 'src')
    const body = await CreateTestOverview.createTestOverview(testPathSrc)
    return {
      body,
      init: {
        status: HttpStatusCode.MultipleChoices,
        headers: {
          [HttpHeader.CacheControl]: 'public, max-age=0, must-revalidate',
          [HttpHeader.CrossOriginEmbedderPolicy]: CrossOriginEmbedderPolicy.value,
          [HttpHeader.CrossOriginOpenerPolicy]: CrossOriginOpenerPolicy.value,
          [HttpHeader.ContentSecurityPolicy]: "default-src 'none'",
        },
      },
    }
  }
  return {
    body: 'not-found',
    init: {
      status: HttpStatusCode.NotFound,
    },
  }
}
