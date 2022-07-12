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

const ExtensionHostHover = await import(
  '../src/parts/ExtensionHost/ExtensionHostHover.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeHoverProvider - no result', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return {}
  })
  expect(
    await ExtensionHostHover.executeHoverProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual({})
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledWith({
    combineResults: expect.any(Function),
    event: 'onHover:test',
    method: 'ExtensionHostHover.execute',
    noProviderFoundMessage: 'No hover provider found',
    params: [1, 0],
  })
})

test('executeHoverProvider - error - hoverProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostHover.executeHoverProvider({ id: 1, languageId: 'test' }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
