import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponse/GetElectronFileResponse.js', () => ({
  getElectronFileResponse: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js', () => ({
  getTestRequestResponse: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/StaticPath/StaticPath.js', () => ({
  getStaticPath: jest.fn(() => '/test/static'),
}))

const GetElectronFileResponse = await import('../src/parts/GetElectronFileResponse/GetElectronFileResponse.js')
const GetTestRequestResponse = await import('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js')
const HandleRequest = await import('../src/parts/HandleRequest/HandleRequest.js')

test('returns a binary file response', async () => {
  const body = Buffer.from([1, 2, 3])
  jest.mocked(GetElectronFileResponse.getElectronFileResponse).mockResolvedValue({
    body,
    init: {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      status: 200,
    },
  })

  const result = await HandleRequest.handleRequest({ headers: {}, method: 'GET', url: '/remote/test.bin' })

  expect(result).toEqual({
    body,
    hasBody: true,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    status: 200,
  })
})

test('returns a test page response', async () => {
  jest.mocked(GetTestRequestResponse.getTestRequestResponse).mockResolvedValue({
    body: '<!doctype html>',
    init: {
      headers: {
        'Content-Type': 'text/html',
      },
      status: 200,
    },
  })
  const request = { headers: {}, method: 'GET', url: '/tests/_all.html' }

  const result = await HandleRequest.handleRequest(request)

  expect(GetTestRequestResponse.getTestRequestResponse).toHaveBeenCalledWith(request, '/test/static/index.html')
  expect(result).toEqual({
    body: '<!doctype html>',
    hasBody: true,
    headers: {
      'Content-Type': 'text/html',
    },
    status: 200,
  })
})

test('omits the body for HEAD requests', async () => {
  jest.mocked(GetElectronFileResponse.getElectronFileResponse).mockResolvedValue({
    body: Buffer.from('test'),
    init: {
      headers: {},
      status: 200,
    },
  })

  const result = await HandleRequest.handleRequest({ headers: {}, method: 'HEAD', url: '/remote/test.txt' })

  expect(result.hasBody).toBe(false)
})

test('omits the body for not modified responses', async () => {
  jest.mocked(GetElectronFileResponse.getElectronFileResponse).mockResolvedValue({
    body: '',
    init: {
      headers: {
        Etag: 'test-etag',
      },
      status: 304,
    },
  })

  const result = await HandleRequest.handleRequest({ headers: {}, method: 'GET', url: '/remote/test.txt' })

  expect(result.hasBody).toBe(false)
})
