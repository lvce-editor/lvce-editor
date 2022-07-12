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

const ExtensionHostTypeDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeTypeDefinitionProvider', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([])
})

test('executeTypeDefinitionProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
