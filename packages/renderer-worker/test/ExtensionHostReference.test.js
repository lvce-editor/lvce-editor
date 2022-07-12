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

const ExtensionHostReference = await import(
  '../src/parts/ExtensionHost/ExtensionHostReference.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeReferenceProvider - no references found', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostReference.executeReferenceProvider({ id: 1, uri: '' }, 0)
  ).toEqual([])
})

test('executeReferenceProvider - single reference found', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
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
    await ExtensionHostReference.executeReferenceProvider({ id: 1, uri: '' }, 0)
  ).toEqual([
    {
      uri: '/test/index.js',
      lineText: '',
      startOffset: 0,
      endOffset: 0,
    },
  ])
})

test('executeReferenceProvider - error - referenceProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostReference.executeReferenceProvider({ id: 1, uri: '' }, 0)
  ).rejects.toThrowError(
    new Error(
      'Failed to execute reference provider: TypeError: x is not a function'
    )
  )
})
