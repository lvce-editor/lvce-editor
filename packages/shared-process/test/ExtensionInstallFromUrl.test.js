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

const ExtensionInstallFromUrl = await import(
  '../src/parts/ExtensionInstallFromUrl/ExtensionInstallFromUrl.js'
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
  await expect(
    ExtensionInstallFromUrl.install({
      url: 'https://example.com',
    })
  ).rejects.toThrowError(
    new Error('Failed to install "https://example.com": Failed to download ')
  )
})

test('install - error with extraction', async () => {
  // @ts-ignore
  Download.download.mockImplementation(() => {})
  // @ts-ignore
  Extract.extract.mockImplementation((url) => {
    throw new Error(`Failed to extract file ${url}`)
  })
  await expect(
    ExtensionInstallFromUrl.install({
      url: 'https://example.com',
    })
  ).rejects.toThrowError(
    new Error(
      `Failed to install "https://example.com": Failed to extract file /test/tmp-file`
    )
  )
})
