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

const ExtensionHostDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostDefinition.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeDefinitionProvider - no definition found', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    return []
  })
  expect(
    await ExtensionHostDefinition.executeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([])
})

test('executeDefinitionProvider - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider({ id: 1, uri: '' }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
