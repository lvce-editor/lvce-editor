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

const ExtensionHostBraceCompletion = await import(
  '../src/parts/ExtensionHost/ExtensionHostBraceCompletion.js'
)
const ExtensionHostShared = await import(
  '../src/parts/ExtensionHost/ExtensionHostShared.js'
)

test('executeBraceCompletionProvider - no brace completion', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return false
  })
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toBe(false)
})

test('executeBraceCompletionProvider - brace completion', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(() => {
    return true
  })
  expect(
    await ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '' },
      0
    )
  ).toBe(true)
})

test('executeBraceCompletionProvider - error - BraceCompletionProvider throws error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProviders.mockImplementation(async () => {
    throw new Error(
      'Failed to execute BraceCompletion provider: TypeError: x is not a function'
    )
  })
  await expect(
    ExtensionHostBraceCompletion.executeBraceCompletionProvider(
      { id: 1, uri: '' },
      0
    )
  ).rejects.toThrowError(
    new Error(
      'Failed to execute BraceCompletion provider: TypeError: x is not a function'
    )
  )
})
