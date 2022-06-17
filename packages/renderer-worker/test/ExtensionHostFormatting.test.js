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

const ExtensionHostFormatting = await import(
  '../src/parts/ExtensionHost/ExtensionHostFormatting.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeFormattingProvider', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return 'test content'
  })
  expect(
    await ExtensionHostFormatting.executeFormattingProvider({ id: 1 })
  ).toBe('test content')
})

test('executeFormattingProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ExtensionHostFormatting.executeFormattingProvider('memfs:///test.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
