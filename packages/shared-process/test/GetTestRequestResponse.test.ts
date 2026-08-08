import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

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
  error: jest.fn(),
}))

const GetTestRequestResponse = await import('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js')
const GetTestPath = await import('../src/parts/GetTestPath/GetTestPath.js')
const CreateTestOverview = await import('../src/parts/CreateTestOverview/CreateTestOverview.js')
const GetPathName = await import('../src/parts/GetPathName/GetPathName.js')

const temporaryDirectories: string[] = []

afterEach(async () => {
  const directories = [...temporaryDirectories]
  temporaryDirectories.length = 0
  await Promise.all(directories.map((directory: any) => rm(directory, { force: true, recursive: true })))
})

test('getTestRequestResponse', async () => {
  const request = {
    url: '/tests/',
  }
  const indexHtmlPath = '/test/index.html'
  jest.spyOn(GetPathName, 'getPathName').mockReturnValue('/tests/')
  jest.spyOn(CreateTestOverview, 'createTestOverview').mockResolvedValue('test overview html')
  jest.spyOn(GetTestPath, 'getTestPath').mockReturnValue('/test')
  const result = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)
  expect(result).toEqual({
    body: 'test overview html',
    init: {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'",
        'Content-Type': 'text/html',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      status: 200,
    },
  })
  expect(CreateTestOverview.createTestOverview).toHaveBeenCalledWith(join('/test', 'src'))
})

test('getTestRequestResponse - _all.html serves index html', async () => {
  const tmpDir = await mkdtemp(join(tmpdir(), 'lvce-test-request-'))
  temporaryDirectories.push(tmpDir)
  const indexHtmlPath = join(tmpDir, 'index.html')
  await writeFile(indexHtmlPath, '<!doctype html><title>Tests</title>')
  const request = {
    url: '/tests/_all.html',
  }
  jest.spyOn(GetPathName, 'getPathName').mockReturnValue('/tests/_all.html')

  const result = await GetTestRequestResponse.getTestRequestResponse(request, indexHtmlPath)

  expect(result).toMatchObject({
    init: {
      headers: {
        'Content-Security-Policy': expect.stringContaining(`style-src 'self' 'unsafe-inline'`),
        'Content-Type': 'text/html',
      },
      status: 200,
    },
  })
  expect(result.body).toContain('<title>Tests</title>')
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
