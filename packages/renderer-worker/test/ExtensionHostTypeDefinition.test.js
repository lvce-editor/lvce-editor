import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ExtensionHost/ExtensionHostManagement.js',
  () => {
    return {
      activateByEvent: jest.fn(() => {}),
    }
  }
)
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

const ExtensionHostTypeDefinition = await import(
  '../src/parts/ExtensionHost/ExtensionHostTypeDefinition.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeTypeDefinitionProvider', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
        return []
      case 'ExtensionManagement.getExtensions':
        return []
      default:
        throw new Error('unexpected message')
    }
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
  ExtensionHost.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ExtensionHostClosingTag.executeTypeDefinitionProvider':
        throw new TypeError('x is not a function')
      case 'ExtensionManagement.getExtensions':
        return []
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO should also revive error constructor if possible
  // TypeError, SyntaxError, ReferenceError
  await expect(
    ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
