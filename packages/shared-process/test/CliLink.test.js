import { jest } from '@jest/globals'
import * as FileSystemErrorCodes from '../src/parts/FileSystemErrorCodes/FileSystemErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionLink/ExtensionLink.js', () => ({
  link: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionLink = await import(
  '../src/parts/ExtensionLink/ExtensionLink.js'
)
const CliLink = await import('../src/parts/CliLink/CliLink.js')

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
      FileSystemErrorCodes.E_MANIFEST_NOT_FOUND
    )
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await CliLink.handleCliArgs([])
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    "Error: Failed to link extension: Failed to load extension manifest for test: File not found '/test/extension.json'"
  )
})
