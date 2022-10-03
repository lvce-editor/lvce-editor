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

const ExtensionHostTypeDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'
)

test('executeTypeDefinitionProvider', async () => {
  // @ts-ignore
  ExtensionHostEditor.execute.mockImplementation(async () => {
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
  ExtensionHostEditor.execute.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
