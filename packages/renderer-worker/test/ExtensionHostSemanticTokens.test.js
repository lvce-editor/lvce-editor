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
      activateByEvent: jest.fn(() => {}),
    }
  }
)

const ExtensionHostSemanticTokens = await import(
  '../src/parts/ExtensionHost/ExtensionHostSemanticTokens.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeSemanticTokenProvider', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostSemanticTokens.executeSemanticTokenProvider({ id: 1 })
  ).toEqual([])
})

test('executeSemanticTokenProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostSemanticTokens.executeSemanticTokenProvider({ id: 1 })
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
