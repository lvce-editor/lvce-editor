import { jest } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: jest.fn(() => {
    return '/test/extensions'
  }),
  getCachedExtensionsPath: jest.fn(() => {
    return '/test/cached-extensions'
  }),
}))

jest.unstable_mockModule(
  '../src/parts/DownloadAndExtract/DownloadAndExtract.js',
  () => ({
    downloadAndExtractTarGz: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)

jest.unstable_mockModule('../src/parts/TmpFile/TmpFile.js', () => ({
  getTmpFile: jest.fn(() => {
    return '/test/tmp-file'
  }),
  getTmpDir: jest.fn(() => {
    return '/test/tmp-dir'
  }),
}))

const ExtensionInstallFromGitHub = await import(
  '../src/parts/ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js'
)
const DownloadAndExtract = await import(
  '../src/parts/DownloadAndExtract/DownloadAndExtract.js'
)

test('install - error with download', async () => {
  // @ts-ignore
  DownloadAndExtract.downloadAndExtractTarGz.mockImplementation(() => {
    throw new Error(`Failed to download`)
  })
  await expect(
    ExtensionInstallFromGitHub.install({
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    })
  ).rejects.toThrowError(
    new Error('Failed to install user/repo: Failed to download')
  )
})

test('install - error with extraction', async () => {
  // @ts-ignore
  DownloadAndExtract.downloadAndExtractTarGz.mockImplementation(() => {
    throw new Error(`Failed to extract file`)
  })
  await expect(
    ExtensionInstallFromGitHub.install({
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    })
  ).rejects.toThrowError(
    new Error(`Failed to install user/repo: Failed to extract file`)
  )
})
