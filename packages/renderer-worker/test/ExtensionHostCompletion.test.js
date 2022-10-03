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
const ExtensionHostCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostCompletion.js'
)

test('executeCompletionProvider - no results', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
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
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
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
