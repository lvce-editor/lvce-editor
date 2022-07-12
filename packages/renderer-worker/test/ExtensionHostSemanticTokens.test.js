import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProviders: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostSemanticTokens = await import(
  '../src/parts/ExtensionHost/ExtensionHostSemanticTokens.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeSemanticTokenProvider', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(
    await ExtensionHostSemanticTokens.executeSemanticTokenProvider({
      id: 1,
      languageId: 'test',
    })
  ).toEqual([])
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledWith({
    combineResults: expect.any(Function),
    event: 'onSemanticTokens:test',
    method: 'ExtensionHostSemanticTokens.executeSemanticTokenProvider',
    noProviderFoundMessage: 'No Semantic Token Provider found',
    params: [1],
    noProviderFoundResult: [],
  })
})

test('executeSemanticTokenProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider({
      id: 1,
      languageId: 'test',
    })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
