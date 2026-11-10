import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponseContent/GetElectronFileResponseContent', () => {
  return {
    getElectronFileResponseContent: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath', () => {
  return {
    getElectronFileResponseAbsolutePath: jest.fn(() => '/test.ts'),
    isInvalidRemotePathError: jest.fn(() => false),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger', () => {
  return {
    error: jest.fn(),
  }
})

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

const GetElectronFileResponseAbsolutePath = await import('../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.ts')

test('getElectronFileResponse - malformed remote path', async () => {
  jest.mocked(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath).mockImplementationOnce(() => {
    throw new Error('Invalid remote path')
  })
  jest.mocked(GetElectronFileResponseAbsolutePath.isInvalidRemotePathError).mockReturnValueOnce(true)
  const response = await GetElectronFileResponse.getElectronFileResponse('/remote/D:asample.js', undefined)
  expect(response.init.status).toBe(400)
})
