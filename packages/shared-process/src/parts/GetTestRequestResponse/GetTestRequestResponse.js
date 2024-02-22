import { readFile } from 'fs/promises'
import { isAbsolute, join } from 'path'
import { join } from 'path'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.js'
import * as GetPathName from '../GetPathName/GetPathName.js'
import * as GetTestPath from '../GetTestPath/GetTestPath.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const getTestRequestResponse = async (request, indexHtmlPath) => {
  const pathName = getPathName(request)
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
