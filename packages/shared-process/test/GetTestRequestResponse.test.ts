import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/CreateTestOverview/CreateTestOverview.js', () => ({
  createTestOverview: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/GetTestPath/GetTestPath.js', () => ({
  getTestPath: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/GetPathName/GetPathName.js', () => ({
  getPathName: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const GetTestRequestResponse = await import('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js')
const GetTestPath = await import('../src/parts/GetTestPath/GetTestPath.js')
const CreateTestOverview = await import('../src/parts/CreateTestOverview/CreateTestOverview.js')
const GetPathName = await import('../src/parts/GetPathName/GetPathName.js')

test('getTestRequestResponse', async () => {
  const request = {
    url: '/tests/',
  }
  const indexHtmlPath = '/test/index.html'
  jest.spyOn(GetPathName, 'getPathName').mockReturnValue('/tests/')
  jest.spyOn(CreateTestOverview, 'createTestOverview').mockResolvedValue('test overview html')
  jest.spyOn(GetTestPath, 'getTestPath').mockReturnValue('/test')
  expect(await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)).toEqual({
    body: 'test overview html',
    init: {
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Content-Security-Policy': "default-src 'none'",
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      status: 300,
    },
  })
})

test('getTestRequestResponse - error in createTestOverview', async () => {
  const request = {
    url: '/tests/',
  }
  const indexHtmlPath = '/test/index.html'
  jest.spyOn(GetPathName, 'getPathName').mockReturnValue('/tests/')
  jest.spyOn(CreateTestOverview, 'createTestOverview').mockRejectedValue(new TypeError('x is not a function'))
  jest.spyOn(GetTestPath, 'getTestPath').mockReturnValue('/test')
  expect(await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)).toEqual({
    body: 'Internal server error',
    init: {
      status: 500,
    },
  })
})
