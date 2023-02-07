import { jest } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as ExitCode from '../src/parts/ExitCode/ExitCode.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  setExitCode: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/ExtensionLink/ExtensionLink.js', () => ({
  link: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionLink = await import('../src/parts/ExtensionLink/ExtensionLink.js')
const CliLink = await import('../src/parts/CliLink/CliLink.js')
const Process = await import('../src/parts/Process/Process.js')
const Logger = await import('../src/parts/Logger/Logger.js')

class ErrorWithCode extends Error {
  constructor(message, code) {
    super(message, code)
    this.code = code
  }
}

// TODO add e2e tests for cli

test('handleCliArgs - error - manifest not found', async () => {
  // @ts-ignore
  ExtensionLink.link.mockImplementation(() => {
    throw new ErrorWithCode(
      `Error: Failed to link extension: Failed to load extension manifest for test: File not found '/test/extension.json'`,
      ErrorCodes.E_MANIFEST_NOT_FOUND
    )
  })
  await CliLink.handleCliArgs([])
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    "Error: Failed to link extension: Failed to load extension manifest for test: File not found '/test/extension.json'"
  )
  expect(Process.setExitCode).toHaveBeenCalledTimes(1)
  expect(Process.setExitCode).toHaveBeenCalledWith(ExitCode.ExpectedError)
})

test('handleCliArgs - error - permission denied', async () => {
  // @ts-ignore
  ExtensionLink.link.mockImplementation(() => {
    throw new ErrorWithCode(
      'Failed to link extension: EPERM: operation not permittet, symlink /test/my-extension -> /test/linked-extensions/my-extension',
      ErrorCodes.EPERM
    )
  })
  await expect(CliLink.handleCliArgs([])).rejects.toThrowError(
    new Error('Failed to link extension: EPERM: operation not permittet, symlink /test/my-extension -> /test/linked-extensions/my-extension')
  )
})
