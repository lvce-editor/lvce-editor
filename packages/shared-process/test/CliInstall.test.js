import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionInstall/ExtensionInstall', () => {
  return {
    install: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  setExitCode: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const Process = await import('../src/parts/Process/Process.js')
const Logger = await import('../src/parts/Logger/Logger.js')

const CliInstall = await import('../src/parts/CliInstall/CliInstall.js')
const ExtensionInstall = await import('../src/parts/ExtensionInstall/ExtensionInstall.js')

test('handleCliArgs - error - missing extension argument', async () => {
  await CliInstall.handleCliArgs(['install'])
})

test('handleCliArgs - error - decompression error', async () => {
  // TODO should exit with code 128
  // @ts-ignore
  ExtensionInstall.install.mockImplementation(() => {
    throw new Error(`Failed to install: Decompression failed`)
  })
  await expect(CliInstall.handleCliArgs(['install', 'https://example.com/extension'])).rejects.toThrowError(
    new Error(`Failed to install: Decompression failed`)
  )
})

test('handleCliArgs - error - not found', async () => {
  // @ts-ignore
  ExtensionInstall.install.mockImplementation(() => {
    throw new Error(`Failed to install test-extension: Failed to download test://not-found: Response code 404 (Not Found)`)
  })
  await CliInstall.handleCliArgs(['install', 'test://not-found'])
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith('Failed to install test-extension: Failed to download test://not-found: Response code 404 (Not Found)')
  expect(Process.setExitCode).toHaveBeenCalledTimes(1)
  expect(Process.setExitCode).toHaveBeenCalledWith(128)
})

test('handleCliArgs - error - offline', async () => {
  // @ts-ignore
  ExtensionInstall.install.mockImplementation(() => {
    throw new Error(`Failed to install test-extension: Failed to download test://test-extension: getaddrinfo EAI_AGAIN test://test-extension`)
  })
  await CliInstall.handleCliArgs(['install', 'test://test-extension'])
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    'Failed to install test-extension: Failed to download test://test-extension: getaddrinfo EAI_AGAIN test://test-extension'
  )
  expect(Process.setExitCode).toHaveBeenCalledTimes(1)
  expect(Process.setExitCode).toHaveBeenCalledWith(128)
})

test('handleCliArgs', async () => {
  await CliInstall.handleCliArgs(['install', 'https://example.com/extension'])
  expect(ExtensionInstall.install).toHaveBeenCalledTimes(1)
  expect(ExtensionInstall.install).toHaveBeenCalledWith('https://example.com/extension')
})
