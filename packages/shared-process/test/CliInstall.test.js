import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionInstall/ExtensionInstall',
  () => {
    return {
      install: jest.fn(),
    }
  }
)

const CliInstall = await import('../src/parts/CliInstall/CliInstall.js')
const ExtensionInstall = await import(
  '../src/parts/ExtensionInstall/ExtensionInstall.js'
)

test('handleCliArgs - error - missing extension argument', async () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await CliInstall.handleCliArgs(['install'])
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('extension argument is required')
})

test('handleCliArgs - error - decompression error', async () => {
  // @ts-ignore
  ExtensionInstall.install.mockImplementation(() => {
    throw new Error(`Failed to install: Decompression failed`)
  })
  await expect(
    CliInstall.handleCliArgs(['install', 'https://example.com/extension'])
  ).rejects.toThrowError(new Error(`Failed to install: Decompression failed`))
})

test('handleCliArgs', async () => {
  await CliInstall.handleCliArgs(['install', 'https://example.com/extension'])
  expect(ExtensionInstall.install).toHaveBeenCalledTimes(1)
  expect(ExtensionInstall.install).toHaveBeenCalledWith(
    'https://example.com/extension'
  )
})
