import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: jest.fn(() => {
    return '/test/extensions'
  }),
  getCachedExtensionsPath: jest.fn(() => {
    return '/test/cached-extensions'
  }),
}))

jest.unstable_mockModule('../src/parts/Download/Download.js', () => ({
  download: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Extract/Extract.js', () => ({
  extract: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/TmpFile/TmpFile.js', () => ({
  getTmpFile: jest.fn(() => {
    return '/test/tmp-file'
  }),
  getTmpDir: jest.fn(() => {
    return '/test/tmp-dir'
  }),
}))

const ExtensionInstall = await import(
  '../src/parts/ExtensionInstall/ExtensionInstall.js'
)
const Download = await import('../src/parts/Download/Download.js')
const Extract = await import('../src/parts/Extract/Extract.js')
const Platform = await import('../src/parts/Platform/Platform.js')

test('install - error with download', async () => {
  // @ts-ignore
  Download.download.mockImplementation(() => {
    throw new Error(`Failed to download `)
  })
  // @ts-ignore
  Extract.extract.mockImplementation(() => {})
  await expect(ExtensionInstall.install('test/extension')).rejects.toThrowError(
    new Error('Failed to install "test/extension": Failed to download ')
  )
})

test('install - error with extraction', async () => {
  // @ts-ignore
  Download.download.mockImplementation(() => {})
  // @ts-ignore
  Extract.extract.mockImplementation((url) => {
    throw new Error(`Failed to extract file ${url}`)
  })
  await expect(ExtensionInstall.install('test/extension')).rejects.toThrowError(
    new Error(
      `Failed to install "test/extension": Failed to extract file /test/tmp-file`
    )
  )
})
