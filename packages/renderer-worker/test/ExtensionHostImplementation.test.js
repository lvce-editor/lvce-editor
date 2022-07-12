import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostShared.js',
  () => {
    return {
      executeProviders: jest.fn(async () => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ExtensionHostImplementation = await import(
  '../src/parts/ExtensionHost/ExtensionHostImplementation.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeImplementationProvider - no implementations found', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, languageId: 'test' },
      0
    )
  ).toEqual([])
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProviders).toHaveBeenCalledWith({
    combineResults: expect.any(Function),
    event: 'onImplementation:test',
    method: 'ExtensionHostImplementation.executeImplementationProvider',
    noProviderFoundMessage: 'No implementation provider found',
    params: [1, 0],
  })
})

test('executeImplementationProvider - single implementation found', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return [
      {
        uri: '/test/index.js',
        lineText: '',
        startOffset: 0,
        endOffset: 0,
      },
    ]
  })
  expect(
    await ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([
    {
      uri: '/test/index.js',
      lineText: '',
      startOffset: 0,
      endOffset: 0,
    },
  ])
})

test('executeImplementationProvider - error - implementationProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostImplementation.executeImplementationProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to execute implementation provider: TypeError: x is not a function'
    )
  )
})
