import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.js'
import * as GetPathName from '../GetPathName/GetPathName.js'
import * as GetTestPath from '../GetTestPath/GetTestPath.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as ContentSecurityPolicy from '../ContentSecurityPolicy/ContentSecurityPolicy.js'
import * as CrossOriginEmbedderPolicy from '../CrossOriginEmbedderPolicy/CrossOriginEmbedderPolicy.js'
import * as CrossOriginOpenerPolicy from '../CrossOriginOpenerPolicy/CrossOriginOpenerPolicy.js'

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
          'Cache-Control': 'public, max-age=0, must-revalidate',
          [CrossOriginEmbedderPolicy.key]: CrossOriginEmbedderPolicy.value,
          [CrossOriginOpenerPolicy.key]: CrossOriginOpenerPolicy.value,
          'Content-Security-Policy': "default-src 'none'",
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
