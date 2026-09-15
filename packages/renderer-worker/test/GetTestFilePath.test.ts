import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getTestPath: jest.fn(async () => '/remote/test'),
}))
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  exists: jest.fn(async () => false),
}))

const GetTestFilePath = await import('../src/parts/GetTestFilePath/GetTestFilePath.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const PlatformType = await import('../src/parts/PlatformType/PlatformType.js')

test.each([
  'http://localhost:3000/tests/sample.html',
  'http://localhost:3000/tests/sample.html?traceRendererWorker=true',
  'http://localhost:3000/tests/sample.html?traceFocus=true&traceRendererWorker=true#details',
  'http://localhost:3000/tests/sample.html?filter=folder/other.html',
])('resolves the test module from the URL pathname: %s', async (href) => {
  expect(await GetTestFilePath.getTestFilePath(PlatformType.Web, href)).toBe('/remote/test/src/sample.js')
})

test('checks the TypeScript source without passing trace parameters to the filesystem', async () => {
  jest.mocked(FileSystem.exists).mockResolvedValueOnce(true)
  const href = 'http://localhost:3000/tests/sample.html?traceRendererWorker=true'
  expect(await GetTestFilePath.getTestFilePath(PlatformType.Remote, href)).toBe('/remote/test/src/sample.ts')
  expect(FileSystem.exists).toHaveBeenCalledWith('file:///test/src/sample.ts')
})
