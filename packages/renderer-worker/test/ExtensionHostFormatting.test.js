import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProvider: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostFormatting = await import(
  '../src/parts/ExtensionHost/ExtensionHostFormatting.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeFormattingProvider', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return 'test content'
  })
  expect(
    await ExtensionHostFormatting.executeFormattingProvider({
      id: 1,
      languageId: 'test',
    })
  ).toBe('test content')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFormatting:test',
    method: 'ExtensionHostFormatting.executeFormattingProvider',
    params: [1],
    noProviderFoundMessage: 'No formatting provider found',
  })
})

test('executeFormattingProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFormatting.executeFormattingProvider({
      id: 1,
      languageId: 'test',
    })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
