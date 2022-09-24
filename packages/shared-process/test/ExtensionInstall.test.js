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
  '../src/parts/ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js',
  () => ({
    install: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)

jest.unstable_mockModule(
  '../src/parts/ExtensionInstallFromUrl/ExtensionInstallFromUrl.js',
  () => ({
    install: jest.fn(() => {
      throw new Error('not implemented')
    }),
  })
)

const ExtensionInstall = await import(
  '../src/parts/ExtensionInstall/ExtensionInstall.js'
)
const ExtensionInstallFromGitHub = await import(
  '../src/parts/ExtensionInstallFromGitHub/ExtensionInstallFromGitHub.js'
)
const ExtensionInstallFromUrl = await import(
  '../src/parts/ExtensionInstallFromUrl/ExtensionInstallFromUrl.js'
)

test('install - from github', async () => {
  // @ts-ignore
  ExtensionInstallFromGitHub.install.mockImplementation(() => {})
  await ExtensionInstall.install('https://github.com/user/repo')
  expect(ExtensionInstallFromGitHub.install).toHaveBeenCalledTimes(1)
  expect(ExtensionInstallFromGitHub.install).toHaveBeenCalledWith({
    branch: 'HEAD',
    repo: 'repo',
    user: 'user',
  })
})

test('install - from url', async () => {
  // @ts-ignore
  ExtensionInstallFromUrl.install.mockImplementation(() => {})
  await ExtensionInstall.install('https://example.com/extension.tar.br')
  expect(ExtensionInstallFromUrl.install).toHaveBeenCalledTimes(1)
  expect(ExtensionInstallFromUrl.install).toHaveBeenCalledWith({
    url: 'https://example.com/extension.tar.br',
  })
})
