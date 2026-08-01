import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponseContent/GetElectronFileResponseContent', () => {
  return {
    getElectronFileResponseContent: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath', () => {
  return {
    getElectronFileResponseAbsolutePath: jest.fn(() => '/test.ts'),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger', () => {
  return {
    error: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetPathEtag/GetPathEtag', () => ({
  getPathEtag: jest.fn(async () => ({ etag: 'etag', stats: { size: 4 } })),
}))

jest.unstable_mockModule('../src/parts/GetHeaders/GetHeaders', () => ({
  getHeaders: jest.fn(async () => ({})),
}))

const GetElectronFileResponse = await import('../src/parts/GetElectronFileResponse/GetElectronFileResponse.js')
const GetElectronFileResponseContent = await import('../src/parts/GetElectronFileResponseContent/GetElectronFileResponseContent.js')

test('getElectronFileResponse - TypeScript syntax error', async () => {
  const error: any = new SyntaxError('Unexpected token')
  error.code = 'ERR_INVALID_TYPESCRIPT_SYNTAX'
  jest.mocked(GetElectronFileResponseContent.getElectronFileResponseContent).mockRejectedValue(error)

  const response = await GetElectronFileResponse.getElectronFileResponse('/remote/test.ts', undefined)

  expect(response).toEqual({
    body: 'TypeScript file has a syntax error',
    init: {
      headers: {},
      status: 422,
      statusText: 'TypeScript file has a syntax error',
    },
  })
})

test('getElectronFileResponse - other error', async () => {
  jest.mocked(GetElectronFileResponseContent.getElectronFileResponseContent).mockRejectedValue(new Error('Failed to transpile TypeScript'))

  const response = await GetElectronFileResponse.getElectronFileResponse('/remote/test.ts', undefined)

  expect(response).toEqual({
    body: 'server-error',
    init: {
      headers: {},
      status: 500,
      statusText: 'server-error',
    },
  })
})

test('getElectronFileResponse - secret document is never cached or returned as 304', async () => {
  jest.mocked(GetElectronFileResponseContent.getElectronFileResponseContent).mockResolvedValue(Buffer.from('html'))

  const response = await GetElectronFileResponse.getElectronFileResponse('/', {
    headers: {
      'if-none-match': 'etag',
      'sec-fetch-dest': 'document',
    },
  })

  expect(response.init.status).toBe(200)
  expect(response.init.headers['Cache-Control']).toBe('no-store')
})
