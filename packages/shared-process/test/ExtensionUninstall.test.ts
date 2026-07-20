import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('node:fs/promises', () => ({
  access: jest.fn(),
  rm: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => ({
  getExtensionsPath: jest.fn(() => '/test/extensions'),
}))

jest.unstable_mockModule('../src/parts/Trash/Trash.js', () => ({
  trash: jest.fn(),
}))

const fs = await import('node:fs/promises')
const ExtensionUninstall = await import('../src/parts/ExtensionUninstall/ExtensionUninstall.js')
const PlatformPaths = await import('../src/parts/PlatformPaths/PlatformPaths.js')
const Trash = await import('../src/parts/Trash/Trash.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(fs.access).mockResolvedValue(undefined)
  jest.mocked(fs.rm).mockResolvedValue(undefined)
  jest.mocked(PlatformPaths.getExtensionsPath).mockReturnValue('/test/extensions')
  jest.mocked(Trash.trash).mockResolvedValue(undefined)
})

test('moves extension to trash', async () => {
  await ExtensionUninstall.uninstall('test-author.test-extension')

  expect(Trash.trash).toHaveBeenCalledWith('/test/extensions/test-author.test-extension')
  expect(fs.rm).not.toHaveBeenCalled()
})

test('permanently deletes extension when moving to trash fails', async () => {
  jest.mocked(Trash.trash).mockRejectedValue(new Error('Trash is unavailable'))

  await ExtensionUninstall.uninstall('test-author.test-extension')

  expect(fs.rm).toHaveBeenCalledWith('/test/extensions/test-author.test-extension', {
    recursive: true,
  })
})

test('throws when moving to trash and permanent deletion fail', async () => {
  jest.mocked(Trash.trash).mockRejectedValue(new Error('Trash is unavailable'))
  jest.mocked(fs.rm).mockRejectedValue(new Error('Permission denied'))

  await expect(ExtensionUninstall.uninstall('test-author.test-extension')).rejects.toThrow(
    new Error('Failed to uninstall extension "test-author.test-extension": Permission denied'),
  )
})

test('throws when extension does not exist', async () => {
  jest.mocked(fs.access).mockRejectedValue(new Error('Extension does not exist'))

  await expect(ExtensionUninstall.uninstall('test-author.test-extension')).rejects.toThrow(
    new Error('Failed to uninstall extension "test-author.test-extension": Extension does not exist'),
  )
  expect(Trash.trash).not.toHaveBeenCalled()
  expect(fs.rm).not.toHaveBeenCalled()
})
