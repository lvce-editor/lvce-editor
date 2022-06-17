import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostCore.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(),
    }
  }
)

const ExtensionHostDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostDefinition.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeDefinitionProvider - no definition found', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
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
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostDefinition.executeDefinitionProvider({ id: 1, uri: '' }, 0)
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
