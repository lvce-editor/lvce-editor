import { jest } from '@jest/globals'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js',
  () => {
    return {
      execute: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostEditor = await import(
  '../src/parts/ExtensionHost/ExtensionHostEditor.js'
)

const ExtensionHostFormatting = await import(
  '../src/parts/ExtensionHost/ExtensionHostFormatting.js'
)

test('executeFormattingProvider', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    return 'test content'
  })
  const editor = {
    id: 1,
    languageId: 'test',
  }
  expect(await ExtensionHostFormatting.executeFormattingProvider(editor)).toBe(
    'test content'
  )
  expect(ExtensionHostEditor.execute).toHaveBeenCalledTimes(1)
  expect(ExtensionHostEditor.execute).toHaveBeenCalledWith({
    editor,
    event: ExtensionHostActivationEvent.OnFormatting,
    method: 'ExtensionHostFormatting.executeFormattingProvider',
    args: [],
    noProviderFoundMessage: 'No formatting provider found',
    combineResults: expect.any(Function),
  })
})

test('executeFormattingProvider - error', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFormatting.executeFormattingProvider({
      id: 1,
      languageId: 'test',
    })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
