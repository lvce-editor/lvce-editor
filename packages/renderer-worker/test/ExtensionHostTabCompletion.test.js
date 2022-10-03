import { jest } from '@jest/globals'

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

const ExtensionHostTabCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostTabCompletion.js'
)

test('executeTabCompletionProvider - no tab completion', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return undefined
  })
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toBe(undefined)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledWith({
    combineResults: expect.any(Function),
    event: 'onTabCompletion:test',
    method: 'ExtensionHost.executeTabCompletionProvider',
    noProviderFoundMessage: 'No tab completion provider found',
    params: [1, 0],
  })
})

test('executeTabCompletionProvider - tab completion', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return {}
  })
  expect(
    await ExtensionHostTabCompletion.executeTabCompletionProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual({})
})

test('executeTabCompletionProvider - error - tabCompletionProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostTabCompletion.executeTabCompletionProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
