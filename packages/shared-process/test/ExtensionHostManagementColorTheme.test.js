import { jest } from '@jest/globals'

jest.unstable_mockModule(
  '../src/parts/ExtensionManagement/ExtensionManagement.js',
  () => ({
    getExtensions: jest.fn(() => {
      return [
        {
          path: '/test/extension-1',
          colorThemes: [
            {
              id: 'test-theme-1',
            },
          ],
        },
      ]
    }),
  })
)
jest.unstable_mockModule('../src/parts/Path/Path.js', () => ({
  join(...parts) {
    return parts.join('/')
  },
}))

jest.unstable_mockModule(
  '../src/parts/FileSystemWatch/FileSystemWatch.js',
  () => ({
    watchFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionHostManagementColorTheme = await import(
  '../src/parts/ExtensionManagement/ExtensionManagementColorTheme.js'
)
const FileSystemWatch = await import(
  '../src/parts/FileSystemWatch/FileSystemWatch.js'
)

test('watch', async () => {
  // @ts-ignore
  FileSystemWatch.watchFile.mockImplementation(() => {
    return [{}]
  })
  const webSocket = {
    send: jest.fn(),
  }

  await ExtensionHostManagementColorTheme.watch(webSocket, 'test-theme-1')
  expect(webSocket.send).toHaveBeenCalledTimes(1)
  expect(webSocket.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'ColorTheme.reload',
    params: [],
  })
})
