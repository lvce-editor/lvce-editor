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

const ExtensionHostCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostCompletion.js'
)
const ExtensionHost = await import(
  '../src/parts/ExtensionHost/ExtensionHostCore.js'
)

test('executeCompletionProvider - no results', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    return []
  })
  expect(
    await ExtensionHostCompletion.executeCompletionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toEqual([])
})

test('executeCompletionProvider - error', async () => {
  // @ts-ignore
  ExtensionHost.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const promise = ExtensionHostCompletion.executeCompletionProvider(
    { id: 1, uri: '' },
    0
  )
  await expect(promise).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})
