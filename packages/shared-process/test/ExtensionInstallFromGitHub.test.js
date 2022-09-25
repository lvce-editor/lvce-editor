import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getExtensionsPath: () => {
    return '/test/extensions'
  },
  getCachedExtensionsPath: () => {
    return '/test/cached-extensions'
  },
}))

jest.unstable_mockModule(
  '../src/parts/DownloadAndExtract/DownloadAndExtract.js',
  () => ({
    downloadAndExtractTarGz: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)
jest.unstable_mockModule('../src/parts/Path/Path.js', () => ({
  join: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/TmpFile/TmpFile.js', () => ({
  getTmpFile: () => {
    return '/test/tmp-file'
  },
  getTmpDir: () => {
    return '/test/tmp-dir'
  },
}))

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  readFile: jest.fn(() => {
    throw new Error('not implemented')
  }),
  remove: jest.fn(() => {
    throw new Error('not implemented')
  }),
  rename: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionInstallFromGitHub = await import(
  '../src/parts/ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js'
)
const DownloadAndExtract = await import(
  '../src/parts/DownloadAndExtract/DownloadAndExtract.js'
)
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Path = await import('../src/parts/Path/Path.js')

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

test('install - error - missing id in extension manifest', async () => {
  // @ts-ignore
  DownloadAndExtract.downloadAndExtractTarGz.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `{}`
  })
  // @ts-ignore
  Path.join.mockImplementation((...parts) => {
    return parts.join('/')
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  await expect(
    ExtensionInstallFromGitHub.install({
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    })
  ).rejects.toThrowError(
    new Error(`Failed to install user/repo: missing id in extension manifest`)
  )
})

// TODO improve error handling
test('install - error - manifest contains null', async () => {
  // @ts-ignore
  DownloadAndExtract.downloadAndExtractTarGz.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `null`
  })
  // @ts-ignore
  Path.join.mockImplementation((...parts) => {
    return parts.join('/')
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  await expect(
    ExtensionInstallFromGitHub.install({
      user: 'user',
      repo: 'repo',
      branch: 'HEAD',
    })
  ).rejects.toThrowError(
    new Error(
      "Failed to install user/repo: Cannot read properties of null (reading 'id')"
    )
  )
})

test('install', async () => {
  // @ts-ignore
  DownloadAndExtract.downloadAndExtractTarGz.mockImplementation(() => {})
  // @ts-ignore
  Path.join.mockImplementation((...parts) => {
    return parts.join('/')
  })
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return `{
  "id": "test.test-extension"
}`
  })
  await ExtensionInstallFromGitHub.install({
    user: 'user',
    repo: 'repo',
    branch: 'HEAD',
  })
  expect(DownloadAndExtract.downloadAndExtractTarGz).toHaveBeenCalledTimes(1)
  expect(DownloadAndExtract.downloadAndExtractTarGz).toHaveBeenCalledWith({
    outDir: '/test/tmp-dir',
    strip: 1,
    url: 'https://codeload.github.com/user/repo/tar.gz/HEAD',
  })
  expect(FileSystem.readFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.readFile).toHaveBeenCalledWith(
    `/test/tmp-dir/extension.json`
  )
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith(
    '/test/tmp-dir',
    '/test/extensions/test.test-extension'
  )
})
