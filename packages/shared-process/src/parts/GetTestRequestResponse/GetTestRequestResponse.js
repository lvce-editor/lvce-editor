import { isAbsolute, join } from 'path'
import * as CreateTestOverview from '../CreateTestOverview/CreateTestOverview.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as Root from '../Root/Root.js'

const getPathName = (request) => {
  const { pathname } = new URL(request.url || '', `https://${request.headers.host}`)
  return pathname
}

const getTestPath = () => {
  if (process.env.TEST_PATH) {
    const testPath = process.env.TEST_PATH
    if (isAbsolute(testPath)) {
      return testPath
    }
    return join(process.cwd(), testPath)
  }
  return join(Root.root, 'packages', 'extension-host-worker-tests')
}

export const getTestRequestResponse = async (request) => {
  const pathName = getPathName(request)
  if (pathName.endsWith('.html')) {
    return {
      body: '',
      init: {
        status: HttpStatusCode.Ok,
        headers: {},
      },
    }
  }
  if (pathName === '/tests/') {
    const testPath = getTestPath()
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
